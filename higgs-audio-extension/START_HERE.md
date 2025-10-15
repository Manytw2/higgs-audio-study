# 🎯 从这里开始 - Higgs Audio VSCode插件

## ✅ 当前状态
- ✅ 所有依赖已安装
- ✅ 代码已编译
- ✅ 配置文件正确
- ✅ 插件可以运行

## 🚀 立即启动插件

### 方法1: 使用F5调试（推荐）

1. **打开VSCode**
   ```bash
   # 在终端中运行
   code higgs-audio-extension
   ```

2. **启动调试**
   - 按 `F5` 键
   - 或点击左侧"运行和调试"图标
   - 选择"启动扩展"配置
   - 等待新窗口打开

3. **测试插件**
   - 在新窗口中按 `Ctrl+Shift+P`
   - 输入 "Higgs Audio"
   - 选择 "Higgs Audio: 打开聊天"

### 方法2: 手动启动

1. **编译代码**
   ```bash
   npm run compile
   ```

2. **启动VSCode**
   ```bash
   code higgs-audio-extension
   ```

3. **运行调试**
   - 按 `F5`
   - 选择"启动扩展"

## 🎮 测试功能

### 基本功能测试
1. **打开聊天界面**
   - `Ctrl+Shift+P` → "Higgs Audio: 打开聊天"
   - 应该显示聊天界面

2. **文本转语音**
   - 在聊天界面输入文本
   - 点击发送按钮
   - 等待音频生成

3. **从编辑器生成**
   - 在编辑器中选中文本
   - 右键选择"生成音频"
   - 或使用命令面板

### 高级功能测试
1. **语音克隆**
   - 点击"上传语音样本"
   - 选择音频文件
   - 输入对应文本

2. **设置调整**
   - `Ctrl+,` 打开设置
   - 搜索"Higgs Audio"
   - 调整各种参数

## 🔧 故障排除

### 问题1: F5没反应
**解决方案:**
```bash
# 1. 确保在正确的目录
cd higgs-audio-extension

# 2. 重新编译
npm run compile

# 3. 重启VSCode
code higgs-audio-extension
```

### 问题2: 插件无法加载
**解决方案:**
1. 检查VSCode版本（需要1.74.0+）
2. 查看开发者控制台错误信息
3. 确保所有文件都存在

### 问题3: Python服务器问题
**解决方案:**
```bash
# 安装Python依赖
pip install fastapi uvicorn python-multipart

# 测试Python服务器
python src/python/higgs_audio_server.py --help
```

## 📊 成功标志

插件成功启动的标志：
- ✅ 新VSCode窗口打开
- ✅ 侧边栏显示Higgs Audio图标
- ✅ 命令面板可以找到Higgs Audio命令
- ✅ 聊天界面可以正常打开
- ✅ 可以输入文本并生成音频

## 🎯 下一步

1. **测试基本功能**
   - 文本转语音
   - 音频播放
   - 文件下载

2. **探索高级功能**
   - 语音克隆
   - 参数调整
   - 历史记录

3. **自定义配置**
   - 调整生成参数
   - 设置模型路径
   - 配置设备选项

## 📚 相关文档

- `README.md` - 完整文档
- `QUICK_START.md` - 快速启动指南
- `DEMO.md` - 功能演示
- `VERSION_MANAGEMENT.md` - 版本管理

## 🆘 获取帮助

如果遇到问题：
1. 查看本文档的故障排除部分
2. 检查VSCode开发者控制台的错误信息
3. 运行 `node test-extension.js` 检查状态
4. 提交Issue到GitHub仓库

---

**🎉 现在就开始使用Higgs Audio VSCode插件吧！**
