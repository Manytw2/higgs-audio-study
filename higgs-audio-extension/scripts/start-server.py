#!/usr/bin/env python3
"""
快速启动Higgs Audio Python服务器
用于开发和测试
"""

import sys
import os
from pathlib import Path

# 添加项目路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root / "src" / "python"))

if __name__ == "__main__":
    try:
        from higgs_audio_server import main
        main()
    except ImportError as e:
        print(f"导入错误: {e}")
        print("请确保已安装所有依赖:")
        print("pip install fastapi uvicorn python-multipart")
        sys.exit(1)
    except Exception as e:
        print(f"启动失败: {e}")
        sys.exit(1)
