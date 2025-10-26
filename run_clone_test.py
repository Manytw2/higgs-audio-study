from boson_multimodal.serve.serve_engine import HiggsAudioServeEngine, HiggsAudioResponse
from boson_multimodal.data_types import ChatMLSample, Message, AudioContent

import torch
import torchaudio
import os 
import time

# --- 模型和路径配置 ---
MODEL_PATH = "bosonai/higgs-audio-v2-generation-3B-base"
AUDIO_TOKENIZER_PATH = "bosonai/higgs-audio-v2-tokenizer"

# --- 优化方案：强化口音的 System Prompt (从上一个最成功的版本继承) ---
system_prompt = (
    "Generate Chinese audio following instruction. **Strictly imitate the acoustic style, accent, and prosody of the voice provided in the reference audio.**"
)


# --- 设备配置 ---
device = "cuda" if torch.cuda.is_available() else "cpu"
# 为了避免显存不足的风险，我们继续在 CPU 上运行，如果需要加速请手动修改为 'cuda'
if device == "cuda":
    device = "cpu"
print(f"--- Running on device: {device} ---")


# --- START OF CLONING SETUP (最终修正结构) ---

# 1. 定义参考音频和文本路径
REF_AUDIO_RELATIVE_PATH = os.path.join("examples", "voice_prompts", "zh_man_sichuan.wav")
REF_TEXT_RELATIVE_PATH = os.path.join("examples", "voice_prompts", "zh_man_sichuan.txt")

REF_AUDIO_ABSOLUTE_PATH = os.path.abspath(REF_AUDIO_RELATIVE_PATH) 
REF_TEXT_ABSOLUTE_PATH = os.path.abspath(REF_TEXT_RELATIVE_PATH) 

# 您的中文目标文本
TARGET_TEXT = "我是威龙，威风的龙，我帅的要命"


# 2. 【核心修正】读取参考音频对应的文本内容
try:
    with open(REF_TEXT_ABSOLUTE_PATH, 'r', encoding='utf-8') as f:
        # 读取内容并移除可能的回车或换行符
        REFERENCE_TEXT_CONTENT = f.read().strip()
except FileNotFoundError:
    print(f"ERROR: Reference text file not found at {REF_TEXT_ABSOLUTE_PATH}")
    # 如果文件没找到，则回退到占位符（但不推荐）
    REFERENCE_TEXT_CONTENT = "这是用于声音克隆的参考音频片段。" 
    
# 将读取到的实际文本赋值给用于 ChatML 结构的变量
REFERENCE_TEXT_PLACEHOLDER = REFERENCE_TEXT_CONTENT
print(f"Loaded reference text: '{REFERENCE_TEXT_PLACEHOLDER}'")


# 3. 构建 AudioContent 实例
print(f"Setting reference audio URL (Absolute Path) to: {REF_AUDIO_ABSOLUTE_PATH}")
audio_content = AudioContent(
    audio_url=REF_AUDIO_ABSOLUTE_PATH, 
) 

# 4. 构建 ChatML 格式的消息序列 
messages = [
    # 消息 0: 系统指令（强化口音）
    Message(
        role="system",
        content=system_prompt,
    ),
    # 消息 1: 用户提供【正确的参考文本】
    Message(
        role="user",
        content=REFERENCE_TEXT_PLACEHOLDER,
    ),
    # 消息 2: 助手提供音频内容（音色模板，assistant）
    Message(
        role="assistant",
        content=audio_content,
    ),
    # 消息 3: 用户提供目标文本 (要生成语音的内容，user)
    Message(
        role="user",
        content=TARGET_TEXT,
    ),
]

chat_ml_sample = ChatMLSample(messages=messages)

# --- END OF CLONING SETUP ---


# --- 模型加载和生成 ---

print("--- Loading Model ---")
serve_engine = HiggsAudioServeEngine(MODEL_PATH, AUDIO_TOKENIZER_PATH, device=device)
print("--- Model Loaded Successfully ---")

print(f"--- Generating audio for: {TARGET_TEXT} ---")
start_time = time.time()

# 使用最保守且稳定的解码参数
output: HiggsAudioResponse = serve_engine.generate(
    chat_ml_sample=chat_ml_sample,
    max_new_tokens=1024,
    temperature=0.3,
    top_p=0.95,
    top_k=50,
    stop_strings=["<|end_of_text|>", "<|eot_id|>"],
)

end_time = time.time()
print(f"--- Generation finished in {end_time - start_time:.2f} seconds. ---")


# --- 保存文件 ---
# 确保输出路径是绝对路径，且存在 output 文件夹
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "chinese_cloned_voice_final_success.wav")

torchaudio.save(output_path, torch.from_numpy(output.audio)[None, :], output.sampling_rate)
print(f"Cloned audio successfully saved to: {output_path}")