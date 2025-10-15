# 🚀 F5调试启动指南

## 🔍 问题诊断

如果F5启动后立即终止，没有打开Extension Development Host窗口，请按照以下步骤排查：

### 1. 检查工作区设置

**重要**: 确保您在VSCode中打开的是 `higgs-audio-extension` 文件夹，而不是父目录 `higgs-audio-study`。

```bash
# 正确的做法
cd higgs-audio-extension
code .  # 在VSCode中打开这个文件夹
```

### 2. 检查启动配置

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Debug: Select and Start Debugging"
3. 选择 "启动扩展" 配置

### 3. 手动测试编译

在终端中运行：
```bash
npm run compile
```

如果编译失败，请检查TypeScript错误。

### 4. 检查关键文件

确保以下文件存在且正确：
- ✅ `package.json` - 插件配置
- ✅ `launch.json` - 调试配置  
- ✅ `tasks.json` - 任务配置
- ✅ `out/extension.js` - 编译输出

### 5. 使用简化版本测试

如果原版本有问题，可以尝试简化版本：

1. 备份当前文件：
   ```bash
   cp package.json package.json.backup
   cp launch.json launch.json.backup
   cp src/extension.ts src/extension.ts.backup
   ```

2. 使用简化版本：
   ```bash
   cp package-simple.json package.json
   cp launch-simple.json launch.json
   cp src/extension-simple.ts src/extension.ts
   ```

3. 重新编译和测试：
   ```bash
   npm run compile
   # 然后按F5测试
   ```

### 6. 检查VSCode开发者控制台

1. 按 `Ctrl+Shift+I` 打开开发者工具
2. 查看Console标签页的错误信息
3. 查看Network标签页的网络请求

### 7. 常见错误和解决方案

#### 错误: "Cannot find module"
- 检查 `package.json` 中的 `main` 字段
- 确保 `out/extension.js` 文件存在

#### 错误: "preLaunchTask failed"
- 检查 `tasks.json` 中是否有 `npm: compile` 任务
- 确保 `package.json` 中有 `compile` 脚本

#### 错误: "Extension host terminated unexpectedly"
- 检查 `extension.ts` 中是否有语法错误
- 尝试使用简化版本的extension

### 8. 调试步骤总结

```bash
# 1. 确保在正确目录
cd higgs-audio-extension

# 2. 检查文件结构
ls -la

# 3. 手动编译
npm run compile

# 4. 检查编译输出
ls out/

# 5. 在VSCode中打开项目
code .

# 6. 选择正确的启动配置
# 按F5，选择"启动扩展"

# 7. 如果失败，查看开发者控制台
# 按Ctrl+Shift+I查看错误信息
```

### 9. 成功启动的标志

当F5成功启动时，您应该看到：
- 新的VSCode窗口打开（Extension Development Host）
- 原窗口显示 "Extension Development Host" 标题
- 新窗口中可以看到您的插件功能

### 10. 测试插件功能

在新窗口中：
1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Higgs Audio" 查看可用命令
3. 尝试运行命令测试功能

---

## 🆘 如果仍然无法启动

请提供以下信息：
1. VSCode版本
2. 错误信息截图
3. 开发者控制台的错误日志
4. 当前工作目录路径

这样我可以提供更具体的帮助！
