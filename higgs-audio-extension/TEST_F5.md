# 🔧 F5调试测试指南

## 🎯 目标
确保VSCode插件可以通过F5正常启动Extension Development Host窗口

## 📋 测试步骤

### 方法1: 使用最简化版本（推荐）

1. **备份当前配置**
   ```bash
   # 备份当前文件
   copy package.json package-backup.json
   copy launch.json launch-backup.json
   ```

2. **使用最简化配置**
   ```bash
   # 使用最简化的配置
   copy package-minimal.json package.json
   copy launch-minimal.json launch.json
   ```

3. **编译最简化版本**
   ```bash
   npx tsc src/extension-minimal.ts --outDir out --target ES2020 --module commonjs --lib ES2020 --moduleResolution node --esModuleInterop
   ```

4. **启动调试**
   - 在VSCode中打开 `higgs-audio-extension` 文件夹
   - 按 `F5` 键
   - 应该会打开新的Extension Development Host窗口

5. **测试功能**
   - 在新窗口中按 `Ctrl+Shift+P`
   - 输入 "Hello Higgs Audio"
   - 应该显示消息

### 方法2: 使用完整版本

1. **确保编译成功**
   ```bash
   npm run compile
   ```

2. **检查关键文件**
   - `out/extension.js` 存在
   - `package.json` 配置正确
   - `launch.json` 配置正确

3. **启动调试**
   - 按 `F5`
   - 选择"启动扩展"配置

## 🔍 故障排除

### 问题1: F5没有反应
**可能原因:**
- VSCode没有识别到插件项目
- launch.json配置错误
- 编译失败

**解决方案:**
```bash
# 1. 确保在正确的目录
pwd
# 应该显示: .../higgs-audio-extension

# 2. 检查VSCode是否识别项目
# 查看VSCode状态栏是否显示"TypeScript"和"JavaScript"

# 3. 重新编译
npm run compile

# 4. 重启VSCode
```

### 问题2: 编译失败
**解决方案:**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run compile
```

### 问题3: Extension Development Host窗口没有打开
**可能原因:**
- 插件激活失败
- 依赖问题

**解决方案:**
1. 查看VSCode开发者控制台 (`Ctrl+Shift+I`)
2. 检查错误信息
3. 使用最简化版本测试

## ✅ 成功标志

插件成功启动的标志：
- ✅ 新的VSCode窗口打开（标题包含"Extension Development Host"）
- ✅ 原窗口显示"调试控制台"
- ✅ 新窗口可以正常使用
- ✅ 命令面板可以找到插件命令

## 🧪 测试命令

在新窗口中测试以下命令：
1. `Ctrl+Shift+P` → "Hello Higgs Audio"
2. `Ctrl+Shift+P` → "Higgs Audio: 打开聊天"
3. 检查侧边栏是否有Higgs Audio图标

## 📊 调试信息

### 查看日志
- **VSCode日志**: 开发者控制台 (`Ctrl+Shift+I`)
- **插件日志**: 调试控制台
- **编译日志**: 终端输出

### 常用调试命令
```bash
# 检查编译状态
npm run compile

# 检查文件结构
dir out

# 检查package.json
type package.json

# 检查launch.json
type launch.json
```

## 🚀 下一步

一旦F5可以正常工作：
1. 恢复完整版本的配置
2. 逐步添加功能
3. 测试完整功能

---

**提示**: 如果最简化版本可以工作，说明VSCode插件框架正常，问题在于复杂功能的实现。
