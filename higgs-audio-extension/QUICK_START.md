# 🚀 Higgs Audio VSCode插件快速启动指南

## 📋 前置要求

1. **Node.js**: 版本16或更高
2. **Python**: 版本3.10或更高
3. **VSCode**: 版本1.74.0或更高
4. **Higgs Audio**: 已安装Higgs Audio项目

## ⚡ 快速启动步骤

### 1. 安装依赖
```bash
cd higgs-audio-extension
npm install
```

### 2. 编译插件
```bash
npm run compile
```

### 3. 启动调试
- 在VSCode中打开 `higgs-audio-extension` 文件夹
- 按 `F5` 或点击"运行和调试"
- 选择"启动扩展"配置
- 等待新窗口打开

### 4. 测试插件
在新打开的VSCode窗口中：
1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Higgs Audio: 打开聊天"
3. 开始使用插件！

## 🔧 故障排除

### 问题1: 按F5没反应
**解决方案:**
1. 确保在VSCode中打开了 `higgs-audio-extension` 文件夹
2. 检查是否有编译错误：`npm run compile`
3. 确保 `out/extension.js` 文件存在
4. 重启VSCode

### 问题2: 编译失败
**解决方案:**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run compile
```

### 问题3: Python服务器启动失败
**解决方案:**
1. 确保Python环境正确
2. 安装Python依赖：
   ```bash
   pip install fastapi uvicorn python-multipart
   ```
3. 检查Higgs Audio是否已安装

### 问题4: 插件无法加载
**解决方案:**
1. 检查VSCode版本是否兼容
2. 查看VSCode开发者控制台的错误信息
3. 确保所有依赖都已正确安装

## 🎯 测试功能

### 基本测试
1. **打开聊天界面**: `Ctrl+Shift+P` → "Higgs Audio: 打开聊天"
2. **输入文本**: 在聊天界面输入"你好，世界"
3. **生成音频**: 点击发送按钮
4. **播放音频**: 点击播放按钮

### 高级测试
1. **语音克隆**: 点击"上传语音样本"
2. **从编辑器生成**: 选中文本，右键选择"生成音频"
3. **设置调整**: 在VSCode设置中搜索"Higgs Audio"

## 📊 调试信息

### 查看日志
- **VSCode日志**: 打开开发者工具 (`Ctrl+Shift+I`)
- **Python日志**: 查看终端输出
- **插件日志**: VSCode输出面板的"Higgs Audio"频道

### 常用调试命令
```bash
# 检查编译状态
npm run compile

# 运行测试
npm test

# 清理构建
npm run clean

# 打包插件
npm run package
```

## 🆘 获取帮助

如果遇到问题：
1. 查看本文档的故障排除部分
2. 检查VSCode开发者控制台的错误信息
3. 查看项目的README.md文档
4. 提交Issue到GitHub仓库

## ✅ 成功标志

插件成功启动的标志：
- ✅ 新VSCode窗口打开
- ✅ 侧边栏显示Higgs Audio图标
- ✅ 命令面板可以找到Higgs Audio命令
- ✅ 聊天界面可以正常打开
- ✅ 可以输入文本并生成音频

---

**提示**: 首次使用可能需要下载模型文件，请耐心等待。
