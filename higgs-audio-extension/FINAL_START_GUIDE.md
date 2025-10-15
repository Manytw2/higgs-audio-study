# 🎯 最终启动指南 - F5调试VSCode插件

## ✅ 当前状态
- ✅ 所有依赖已安装
- ✅ 代码已编译
- ✅ 配置文件正确
- ✅ 插件可以运行

## 🚀 立即启动插件

### 步骤1: 打开VSCode
```bash
# 在终端中运行
code higgs-audio-extension
```

### 步骤2: 启动调试
1. **按F5键** 或点击左侧"运行和调试"图标
2. **选择"启动扩展"配置**
3. **等待新窗口打开**

### 步骤3: 验证成功
- ✅ 新的VSCode窗口打开（标题包含"Extension Development Host"）
- ✅ 原窗口显示"调试控制台"
- ✅ 新窗口可以正常使用

## 🎮 测试功能

### 基本功能测试
1. **测试命令**
   - 在新窗口中按 `Ctrl+Shift+P`
   - 输入 "Higgs Audio"
   - 应该看到以下命令：
     - "Higgs Audio: 打开聊天"
     - "Higgs Audio: 生成音频"
     - "Higgs Audio: 上传语音样本"

2. **测试聊天功能**
   - 选择 "Higgs Audio: 打开聊天"
   - 应该打开聊天界面

3. **测试文本转语音**
   - 在编辑器中选中一些文本
   - 右键选择"生成音频"
   - 或使用命令面板

### 侧边栏测试
1. **查看侧边栏**
   - 应该看到Higgs Audio图标
   - 点击可以展开功能列表

## 🔧 如果F5仍然没有反应

### 方法1: 使用最简化版本
```bash
# 1. 备份当前配置
copy package.json package-backup.json
copy launch.json launch-backup.json

# 2. 使用最简化配置
copy package-minimal.json package.json
copy launch-minimal.json launch.json

# 3. 编译最简化版本
npx tsc src/extension-minimal.ts --outDir out --target ES2020 --module commonjs --lib ES2020 --moduleResolution node --esModuleInterop

# 4. 重启VSCode并测试F5
```

### 方法2: 检查VSCode设置
1. **确保VSCode版本**: 需要1.74.0或更高
2. **检查扩展**: 确保没有冲突的扩展
3. **重启VSCode**: 完全关闭并重新打开

### 方法3: 手动启动
```bash
# 1. 编译代码
npm run compile

# 2. 检查输出
dir out

# 3. 在VSCode中按F5
```

## 📊 成功标志

插件成功启动的标志：
- ✅ 新的VSCode窗口打开
- ✅ 窗口标题包含"Extension Development Host"
- ✅ 命令面板可以找到Higgs Audio命令
- ✅ 侧边栏显示Higgs Audio图标
- ✅ 聊天界面可以正常打开

## 🆘 获取帮助

如果遇到问题：
1. **查看调试控制台**: 原窗口的调试控制台会显示错误信息
2. **查看开发者工具**: 按 `Ctrl+Shift+I` 打开开发者工具
3. **运行测试脚本**: `node test-f5.js` 检查状态
4. **查看详细文档**: `TEST_F5.md` 包含详细的故障排除指南

## 🎯 下一步

一旦F5可以正常工作：
1. **测试所有功能**: 确保插件功能正常
2. **添加新功能**: 逐步完善插件
3. **发布插件**: 打包并发布到VSCode市场

---

**🎉 现在就开始使用Higgs Audio VSCode插件吧！**

**重要提示**: 如果最简化版本可以工作，说明VSCode插件框架正常，问题在于复杂功能的实现。可以逐步恢复完整功能。
