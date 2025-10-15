#!/usr/bin/env python3
"""
测试Higgs Audio API服务器
"""

import requests
import json
import time
import base64

SERVER_URL = "http://localhost:8765"

def test_health():
    """测试健康检查"""
    print("🔄 测试健康检查...")
    try:
        response = requests.get(f"{SERVER_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 服务器健康: {data}")
            return True
        else:
            print(f"❌ 健康检查失败: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 连接失败: {e}")
        return False

def test_generate_audio():
    """测试音频生成"""
    print("🔄 测试音频生成...")
    
    test_data = {
        "text": "你好，这是一个测试音频。",
        "temperature": 0.3,
        "max_tokens": 512,
        "top_p": 0.95,
        "force_audio_gen": True
    }
    
    try:
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=test_data,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print("✅ 音频生成成功")
                print(f"   文本: {data.get('text', '')}")
                print(f"   时长: {data.get('duration', 0):.2f}秒")
                print(f"   采样率: {data.get('sampling_rate', 0)}Hz")
                
                # 保存音频文件
                audio_data = data.get("audio_data", "")
                if audio_data:
                    with open("test_output.wav", "wb") as f:
                        f.write(base64.b64decode(audio_data))
                    print("   音频已保存到: test_output.wav")
                
                return True
            else:
                print(f"❌ 音频生成失败: {data.get('error', '未知错误')}")
                return False
        else:
            print(f"❌ 请求失败: {response.status_code}")
            print(f"   响应: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求异常: {e}")
        return False

def test_get_voices():
    """测试获取语音列表"""
    print("🔄 测试获取语音列表...")
    try:
        response = requests.get(f"{SERVER_URL}/voices", timeout=10)
        if response.status_code == 200:
            data = response.json()
            voices = data.get("voices", [])
            print(f"✅ 可用语音: {voices}")
            return True
        else:
            print(f"❌ 获取语音列表失败: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求异常: {e}")
        return False

def test_get_history():
    """测试获取历史记录"""
    print("🔄 测试获取历史记录...")
    try:
        response = requests.get(f"{SERVER_URL}/history", timeout=10)
        if response.status_code == 200:
            data = response.json()
            history = data.get("history", [])
            print(f"✅ 历史记录数量: {len(history)}")
            return True
        else:
            print(f"❌ 获取历史记录失败: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求异常: {e}")
        return False

def main():
    """主测试流程"""
    print("🧪 Higgs Audio API 测试")
    print("=" * 40)
    
    # 等待服务器启动
    print("⏳ 等待服务器启动...")
    time.sleep(2)
    
    # 运行测试
    tests = [
        ("健康检查", test_health),
        ("获取语音列表", test_get_voices),
        ("获取历史记录", test_get_history),
        ("音频生成", test_generate_audio),
    ]
    
    results = []
    for name, test_func in tests:
        print(f"\n📋 {name}")
        print("-" * 20)
        success = test_func()
        results.append((name, success))
        time.sleep(1)
    
    # 输出结果
    print("\n" + "=" * 40)
    print("📊 测试结果:")
    for name, success in results:
        status = "✅ 通过" if success else "❌ 失败"
        print(f"   {name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n总计: {passed}/{total} 测试通过")
    
    if passed == total:
        print("🎉 所有测试通过！")
    else:
        print("⚠️  部分测试失败，请检查服务器状态")

if __name__ == "__main__":
    main()
