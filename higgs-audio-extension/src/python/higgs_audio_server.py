#!/usr/bin/env python3
"""
Higgs Audio VSCode Extension Python Server
提供HTTP API接口与VSCode扩展通信
"""

import argparse
import asyncio
import base64
import json
import logging
import os
import sys
import tempfile
from datetime import datetime
from io import BytesIO
from typing import Dict, List, Optional, Any
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
import torchaudio
import numpy as np

# 添加Higgs Audio项目路径
current_dir = Path(__file__).parent
higgs_audio_path = current_dir.parent.parent.parent  # 回到项目根目录
sys.path.insert(0, str(higgs_audio_path))

try:
    from boson_multimodal.serve.serve_engine import HiggsAudioServeEngine, HiggsAudioResponse
    from boson_multimodal.data_types import ChatMLSample, Message, AudioContent, TextContent
except ImportError as e:
    print(f"Error importing Higgs Audio modules: {e}")
    print("Please make sure Higgs Audio is properly installed")
    sys.exit(1)

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 全局变量
serve_engine: Optional[HiggsAudioServeEngine] = None
app = FastAPI(title="Higgs Audio VSCode Extension API", version="1.0.0")

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class AudioGenerationRequest(BaseModel):
    text: str
    voice: Optional[str] = None
    temperature: float = 0.3
    max_tokens: int = 1024
    top_p: float = 0.95
    force_audio_gen: bool = False

class AudioGenerationResponse(BaseModel):
    audio_data: str  # base64 encoded
    text: str
    duration: float
    sampling_rate: int
    success: bool
    error: Optional[str] = None

class VoiceCloneRequest(BaseModel):
    name: str
    text: str

class VoiceCloneResponse(BaseModel):
    success: bool
    voice_id: Optional[str] = None
    error: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    audio_data: Optional[str] = None
    timestamp: str

# 存储对话历史
chat_history: List[ChatMessage] = []
voice_library: Dict[str, str] = {}  # voice_id -> voice_name

@app.on_event("startup")
async def startup_event():
    """启动时初始化模型"""
    global serve_engine
    try:
        logger.info("Initializing Higgs Audio model...")
        # 这里会在启动时初始化模型
        logger.info("Model initialization completed")
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        raise

@app.get("/")
async def root():
    """根路径健康检查"""
    return {"message": "Higgs Audio VSCode Extension API", "status": "running"}

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "model_loaded": serve_engine is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate", response_model=AudioGenerationResponse)
async def generate_audio(request: AudioGenerationRequest):
    """生成音频"""
    try:
        if not serve_engine:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        logger.info(f"Generating audio for text: {request.text[:100]}...")
        
        # 构建消息
        messages = [
            Message(
                role="system",
                content="Generate audio following instruction.\n\n<|scene_desc_start|>\nAudio is recorded from a quiet room.\n<|scene_desc_end|>"
            ),
            Message(
                role="user",
                content=request.text
            )
        ]
        
        chat_ml_sample = ChatMLSample(messages=messages)
        
        # 生成音频
        response: HiggsAudioResponse = serve_engine.generate(
            chat_ml_sample=chat_ml_sample,
            max_new_tokens=request.max_tokens,
            temperature=request.temperature,
            top_p=request.top_p,
            force_audio_gen=request.force_audio_gen,
            stop_strings=["<|end_of_text|>", "<|eot_id|>"]
        )
        
        if response.audio is None:
            raise HTTPException(status_code=500, detail="Failed to generate audio")
        
        # 将音频转换为base64
        audio_buffer = BytesIO()
        torchaudio.save(
            audio_buffer,
            torch.from_numpy(response.audio).unsqueeze(0),
            response.sampling_rate,
            format="wav"
        )
        audio_buffer.seek(0)
        audio_base64 = base64.b64encode(audio_buffer.getvalue()).decode('utf-8')
        
        # 计算音频时长
        duration = len(response.audio) / response.sampling_rate
        
        # 保存到历史记录
        chat_message = ChatMessage(
            role="assistant",
            content=request.text,
            audio_data=audio_base64,
            timestamp=datetime.now().isoformat()
        )
        chat_history.append(chat_message)
        
        return AudioGenerationResponse(
            audio_data=audio_base64,
            text=response.generated_text,
            duration=duration,
            sampling_rate=response.sampling_rate,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Audio generation failed: {e}")
        return AudioGenerationResponse(
            audio_data="",
            text="",
            duration=0,
            sampling_rate=0,
            success=False,
            error=str(e)
        )

@app.post("/clone-voice", response_model=VoiceCloneResponse)
async def clone_voice(
    audio_file: UploadFile = File(...),
    text: str = Form(...),
    name: str = Form(...)
):
    """克隆语音"""
    try:
        # 保存上传的音频文件
        audio_content = await audio_file.read()
        
        # 创建临时文件
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            temp_file.write(audio_content)
            temp_audio_path = temp_file.name
        
        try:
            # 这里应该实现语音克隆逻辑
            # 目前只是简单保存到语音库
            voice_id = f"voice_{len(voice_library) + 1}"
            voice_library[voice_id] = name
            
            logger.info(f"Voice cloned: {name} -> {voice_id}")
            
            return VoiceCloneResponse(
                success=True,
                voice_id=voice_id
            )
            
        finally:
            # 清理临时文件
            os.unlink(temp_audio_path)
            
    except Exception as e:
        logger.error(f"Voice cloning failed: {e}")
        return VoiceCloneResponse(
            success=False,
            error=str(e)
        )

@app.get("/voices")
async def get_voices():
    """获取可用语音列表"""
    return {"voices": list(voice_library.keys())}

@app.get("/history")
async def get_history():
    """获取对话历史"""
    return {"history": chat_history}

@app.delete("/history")
async def clear_history():
    """清空对话历史"""
    global chat_history
    chat_history.clear()
    return {"message": "History cleared"}

def initialize_model(model_path: str, audio_tokenizer_path: str, device: str):
    """初始化Higgs Audio模型"""
    global serve_engine
    try:
        logger.info(f"Loading model from {model_path}")
        logger.info(f"Loading audio tokenizer from {audio_tokenizer_path}")
        logger.info(f"Using device: {device}")
        
        serve_engine = HiggsAudioServeEngine(
            model_name_or_path=model_path,
            audio_tokenizer_name_or_path=audio_tokenizer_path,
            device=device
        )
        
        logger.info("Model loaded successfully")
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

def main():
    parser = argparse.ArgumentParser(description="Higgs Audio VSCode Extension Server")
    parser.add_argument("--port", type=int, default=8765, help="Server port")
    parser.add_argument("--model-path", type=str, 
                       default="bosonai/higgs-audio-v2-generation-3B-base",
                       help="Model path")
    parser.add_argument("--audio-tokenizer-path", type=str,
                       default="bosonai/higgs-audio-v2-tokenizer", 
                       help="Audio tokenizer path")
    parser.add_argument("--device", type=str, default="auto", 
                       choices=["auto", "cuda", "cpu"],
                       help="Device to use")
    parser.add_argument("--max-tokens", type=int, default=1024,
                       help="Maximum tokens to generate")
    parser.add_argument("--temperature", type=float, default=0.3,
                       help="Generation temperature")
    parser.add_argument("--top-p", type=float, default=0.95,
                       help="Top-p sampling parameter")
    
    args = parser.parse_args()
    
    # 确定设备
    if args.device == "auto":
        if torch.cuda.is_available():
            device = "cuda"
        else:
            device = "cpu"
    else:
        device = args.device
    
    logger.info(f"Starting Higgs Audio server on port {args.port}")
    logger.info(f"Device: {device}")
    
    # 初始化模型
    try:
        initialize_model(args.model_path, args.audio_tokenizer_path, device)
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        sys.exit(1)
    
    # 启动服务器
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=args.port,
        log_level="info"
    )

if __name__ == "__main__":
    main()
