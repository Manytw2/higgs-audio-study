# Higgs Audio VSCode Extension

基于Higgs Audio V2的智能语音生成VSCode插件，让您可以在编辑器中直接进行AI语音对话。

## ✨ 功能特性

- 🎤 **文本转语音**: 输入文本，AI生成高质量语音
- 🎭 **语音克隆**: 上传语音样本，克隆特定声音
- 💬 **智能对话**: 支持多轮对话和上下文理解
- 🎵 **音频播放**: 内置音频播放器，即时试听
- 💾 **音频下载**: 保存生成的音频文件
- 📚 **历史记录**: 保存对话历史，方便回顾
- ⚙️ **灵活配置**: 支持多种生成参数调整

## 🚀 安装说明

### 前置要求

1. **Python环境**: Python 3.10+
2. **Higgs Audio**: 已安装Higgs Audio项目
3. **VSCode**: 版本1.74.0或更高

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd higgs-audio-extension
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **编译插件**
   ```bash
   npm run compile
   ```

4. **安装Higgs Audio依赖**
   ```bash
   # 确保Higgs Audio项目已安装
   pip install -r ../higgs-audio-study/requirements.txt
   pip install -e ../higgs-audio-study/
   
   # 安装Python服务器依赖
   pip install fastapi uvicorn python-multipart
   ```

5. **打包插件**
   ```bash
   npm install -g vsce
   vsce package
   ```

6. **安装插件**
   - 在VSCode中按`Ctrl+Shift+P`
   - 输入`Extensions: Install from VSIX`
   - 选择生成的`.vsix`文件

## 🎯 使用方法

### 基本使用

1. **打开聊天界面**
   - 点击侧边栏的Higgs Audio图标
   - 或使用命令`Ctrl+Shift+P` → `Higgs Audio: 打开聊天`

2. **生成语音**
   - 在输入框中输入文本
   - 点击"发送"按钮
   - 等待AI生成音频

3. **播放和下载**
   - 点击"播放"按钮试听音频
   - 点击"下载"按钮保存音频文件

### 高级功能

1. **语音克隆**
   - 点击"上传语音样本"
   - 选择音频文件（支持wav, mp3, flac, m4a）
   - 输入对应的文本内容
   - 为语音命名

2. **从编辑器生成**
   - 在编辑器中选中文本
   - 右键选择"生成音频"
   - 或使用命令`Ctrl+Shift+P` → `Higgs Audio: 生成音频`

## ⚙️ 配置选项

在VSCode设置中搜索"Higgs Audio"可以配置以下选项：

- **模型路径**: Higgs Audio模型路径
- **音频分词器路径**: 音频分词器路径
- **计算设备**: auto/cuda/cpu
- **最大token数**: 生成的最大token数量
- **温度**: 生成温度(0.0-2.0)
- **Top-p**: Top-p采样参数(0.0-1.0)
- **自动播放**: 是否自动播放生成的音频
- **保存历史**: 是否保存对话历史

## 🏗️ 项目结构

```
higgs-audio-extension/
├── src/
│   ├── extension.ts              # 主入口文件
│   ├── providers/
│   │   └── higgsAudioProvider.ts # 树形视图提供者
│   ├── python/
│   │   ├── pythonServer.ts       # Python服务器管理
│   │   └── higgs_audio_server.py # Python HTTP服务器
│   └── webview/
│       └── chatWebviewProvider.ts # 聊天界面提供者
├── media/                        # 资源文件
├── package.json                  # 插件配置
└── README.md                     # 说明文档
```

## 🔧 开发指南

### 本地开发

1. **启动开发模式**
   ```bash
   npm run watch
   ```

2. **调试插件**
   - 按`F5`启动调试会话
   - 在新窗口中测试插件功能

3. **测试Python服务器**
   ```bash
   cd src/python
   python higgs_audio_server.py --help
   ```

### 添加新功能

1. **添加新命令**
   - 在`package.json`的`contributes.commands`中添加命令
   - 在`extension.ts`中注册命令处理器

2. **扩展Webview界面**
   - 修改`chatWebviewProvider.ts`中的HTML模板
   - 添加新的消息处理逻辑

3. **扩展Python API**
   - 在`higgs_audio_server.py`中添加新的API端点
   - 在`pythonServer.ts`中添加对应的客户端方法

## 🐛 故障排除

### 常见问题

1. **Python服务器启动失败**
   - 检查Python环境是否正确
   - 确认Higgs Audio依赖已安装
   - 查看VSCode开发者控制台的错误信息

2. **模型加载失败**
   - 检查模型路径配置
   - 确认网络连接正常（首次下载模型）
   - 检查磁盘空间是否充足

3. **音频生成失败**
   - 检查输入文本是否为空
   - 确认Python服务器正在运行
   - 查看服务器日志获取详细错误信息

### 日志查看

- **VSCode日志**: 打开开发者工具(`Ctrl+Shift+I`)
- **Python日志**: 查看VSCode输出面板的"Higgs Audio"频道

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的文本转语音功能
- 支持语音克隆
- 支持音频播放和下载
- 支持对话历史记录

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

本项目基于MIT许可证开源。

## 🙏 致谢

- [Higgs Audio V2](https://github.com/boson-ai/higgs-audio) - 核心AI模型
- [Boson AI](https://www.boson.ai/) - 模型开发团队
- VSCode Extension API - 插件开发框架
