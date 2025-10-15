#!/usr/bin/env python3
"""
Higgs Audio VSCode Extension 安装脚本
自动安装Python依赖和配置环境
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(command, description):
    """运行命令并处理错误"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} 完成")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} 失败: {e.stderr}")
        return False

def check_python_version():
    """检查Python版本"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 10):
        print(f"❌ Python版本过低: {version.major}.{version.minor}")
        print("需要Python 3.10或更高版本")
        return False
    print(f"✅ Python版本: {version.major}.{version.minor}.{version.micro}")
    return True

def check_pip():
    """检查pip是否可用"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], check=True, capture_output=True)
        print("✅ pip 可用")
        return True
    except subprocess.CalledProcessError:
        print("❌ pip 不可用")
        return False

def install_python_dependencies():
    """安装Python依赖"""
    dependencies = [
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "python-multipart>=0.0.6",
        "torch>=2.0.0",
        "torchaudio>=2.0.0",
        "transformers>=4.45.1",
        "librosa>=0.10.0",
        "numpy>=1.24.0",
        "pydantic>=2.0.0",
        "loguru>=0.7.0"
    ]
    
    for dep in dependencies:
        if not run_command(f"{sys.executable} -m pip install {dep}", f"安装 {dep}"):
            return False
    return True

def check_higgs_audio():
    """检查Higgs Audio是否已安装"""
    try:
        import boson_multimodal
        print("✅ Higgs Audio 已安装")
        return True
    except ImportError:
        print("❌ Higgs Audio 未安装")
        print("请先安装Higgs Audio项目:")
        print("1. 克隆项目: git clone https://github.com/boson-ai/higgs-audio.git")
        print("2. 安装依赖: pip install -r requirements.txt")
        print("3. 安装包: pip install -e .")
        return False

def create_config_file():
    """创建配置文件"""
    config_content = """# Higgs Audio VSCode Extension 配置
# 模型配置
MODEL_PATH = "bosonai/higgs-audio-v2-generation-3B-base"
AUDIO_TOKENIZER_PATH = "bosonai/higgs-audio-v2-tokenizer"

# 服务器配置
SERVER_PORT = 8765
SERVER_HOST = "127.0.0.1"

# 生成参数
DEFAULT_TEMPERATURE = 0.3
DEFAULT_MAX_TOKENS = 1024
DEFAULT_TOP_P = 0.95

# 设备配置
DEVICE = "auto"  # auto, cuda, cpu
"""
    
    config_path = Path("config.py")
    try:
        with open(config_path, "w", encoding="utf-8") as f:
            f.write(config_content)
        print("✅ 配置文件已创建: config.py")
        return True
    except Exception as e:
        print(f"❌ 创建配置文件失败: {e}")
        return False

def test_server():
    """测试服务器启动"""
    print("🔄 测试Python服务器...")
    try:
        # 尝试导入服务器模块
        sys.path.insert(0, str(Path(__file__).parent / "src" / "python"))
        import higgs_audio_server
        print("✅ 服务器模块导入成功")
        return True
    except Exception as e:
        print(f"❌ 服务器测试失败: {e}")
        return False

def main():
    """主安装流程"""
    print("🚀 Higgs Audio VSCode Extension 安装程序")
    print("=" * 50)
    
    # 检查Python版本
    if not check_python_version():
        sys.exit(1)
    
    # 检查pip
    if not check_pip():
        sys.exit(1)
    
    # 安装Python依赖
    if not install_python_dependencies():
        print("❌ Python依赖安装失败")
        sys.exit(1)
    
    # 检查Higgs Audio
    if not check_higgs_audio():
        print("⚠️  请先安装Higgs Audio项目后再运行此脚本")
        sys.exit(1)
    
    # 创建配置文件
    if not create_config_file():
        sys.exit(1)
    
    # 测试服务器
    if not test_server():
        print("⚠️  服务器测试失败，但安装可能仍然成功")
    
    print("\n" + "=" * 50)
    print("🎉 安装完成！")
    print("\n下一步:")
    print("1. 在VSCode中安装插件")
    print("2. 按 Ctrl+Shift+P 打开命令面板")
    print("3. 输入 'Higgs Audio: 打开聊天' 开始使用")
    print("\n如有问题，请查看README.md或提交Issue")

if __name__ == "__main__":
    main()
