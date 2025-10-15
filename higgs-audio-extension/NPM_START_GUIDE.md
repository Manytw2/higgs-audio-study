# 🎯 使用npm run build启动VSCode插件

## ✅ 标准开发流程

### 1. 构建插件
```bash
npm run build
```

### 2. 启动调试
```bash
# 方法1: 使用F5调试（推荐）
# 在VSCode中按F5，选择"启动扩展"

# 方法2: 使用命令行
npm run dev
```

### 3. 开发模式（监听文件变化）
```bash
npm run watch
```

## 🚀 快速开始

### 第一次运行
```bash
# 1. 安装依赖
npm install

# 2. 构建插件
npm run build

# 3. 启动调试
# 在VSCode中按F5，或运行：
npm run dev
```

### 开发流程
```bash
# 1. 启动监听模式（在一个终端）
npm run watch

# 2. 启动调试（在VSCode中按F5，或在另一个终端）
npm run dev

# 3. 修改代码，自动重新编译
# 4. 在新窗口中测试功能
```

## 🔧 可用脚本

| 脚本 | 描述 |
|------|------|
| `npm run build` | 编译TypeScript代码 |
| `npm run watch` | 监听文件变化并自动编译 |
| `npm run dev` | 构建并启动开发模式 |
| `npm run clean` | 清理构建输出 |
| `npm run rebuild` | 清理并重新构建 |
| `npm run package` | 打包插件为.vsix文件 |

## 🎯 调试步骤

### 使用F5调试（推荐）
1. **构建插件**
   ```bash
   npm run build
   ```

2. **启动调试**
   - 在VSCode中按F5键
   - 选择"启动扩展"配置
   - 等待Extension Development Host窗口打开

3. **测试功能**
   - 在新窗口中按 `Ctrl+Shift+P`
   - 输入 "Higgs Audio"
   - 测试插件命令

### 使用命令行调试
```bash
# 构建并启动
npm run dev

# 或者分步执行
npm run build
code --extensionDevelopmentPath=.
```

## 📊 成功标志

插件成功启动的标志：
- ✅ `npm run build` 执行成功
- ✅ `out/extension.js` 文件存在
- ✅ 新的VSCode窗口打开（标题包含"Extension Development Host"）
- ✅ 命令面板可以找到Higgs Audio命令
- ✅ 侧边栏显示Higgs Audio图标

## 🔍 故障排除

### 问题1: npm run build失败
```bash
# 解决方案
npm run clean
npm install
npm run build
```

### 问题2: F5没有反应
```bash
# 检查构建状态
npm run build

# 检查VSCode是否识别项目
# 查看状态栏是否显示TypeScript
```

### 问题3: 插件无法加载
```bash
# 检查package.json配置
# 确保main字段指向正确的文件
# 检查activationEvents配置
```

## 🛠️ 开发技巧

### 热重载开发
```bash
# 终端1: 启动监听模式
npm run watch

# 终端2: 启动调试
# 在VSCode中按F5

# 修改代码后自动重新编译
# 在Extension Development Host窗口中重新加载插件
```

### 调试信息
- **插件日志**: 原窗口的调试控制台
- **VSCode日志**: 开发者工具 (`Ctrl+Shift+I`)
- **构建日志**: 终端输出

## 📚 相关文档

- `DEVELOPMENT_GUIDE.md` - 完整开发指南
- `package.json` - 插件配置和脚本
- `launch.json` - 调试配置
- `tasks.json` - 任务配置

## 🎉 总结

现在您可以使用标准的npm脚本来开发VSCode插件：

1. **构建**: `npm run build`
2. **调试**: 在VSCode中按F5
3. **开发**: `npm run watch` + F5
4. **打包**: `npm run package`

---

**🚀 开始使用npm run build开发VSCode插件吧！**
