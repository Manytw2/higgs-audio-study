# 🛠️ Higgs Audio VSCode插件开发指南

## 📋 标准开发流程

### 1. 安装依赖
```bash
npm install
```

### 2. 构建插件
```bash
npm run build
```

### 3. 开发模式（监听文件变化）
```bash
npm run watch
```

### 4. 调试插件
```bash
# 方法1: 使用F5调试
# 在VSCode中按F5，选择"启动扩展"

# 方法2: 使用命令行
npm run dev
```

### 5. 打包插件
```bash
npm run package
```

## 🔧 可用脚本

| 脚本 | 描述 |
|------|------|
| `npm run build` | 编译TypeScript代码 |
| `npm run watch` | 监听文件变化并自动编译 |
| `npm run dev` | 构建并启动开发模式 |
| `npm run package` | 打包插件为.vsix文件 |
| `npm run clean` | 清理构建输出 |
| `npm run rebuild` | 清理并重新构建 |
| `npm run lint` | 代码检查 |
| `npm test` | 运行测试 |

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
# 1. 启动监听模式
npm run watch

# 2. 在另一个终端启动调试
# 在VSCode中按F5

# 3. 修改代码，自动重新编译
# 4. 在新窗口中测试功能
```

## 🎯 调试技巧

### 使用F5调试
1. 在VSCode中打开插件项目
2. 按F5键
3. 选择"启动扩展"配置
4. 等待Extension Development Host窗口打开
5. 在新窗口中测试插件功能

### 查看日志
- **插件日志**: 原窗口的调试控制台
- **VSCode日志**: 开发者工具 (`Ctrl+Shift+I`)
- **构建日志**: 终端输出

### 热重载
- 使用 `npm run watch` 监听文件变化
- 修改代码后自动重新编译
- 在Extension Development Host窗口中重新加载插件

## 📁 项目结构

```
higgs-audio-extension/
├── src/                    # 源代码
│   ├── extension.ts        # 主入口文件
│   ├── providers/          # 视图提供者
│   ├── webview/           # Webview组件
│   └── python/            # Python服务器
├── out/                   # 编译输出
├── package.json           # 插件配置
├── tsconfig.json          # TypeScript配置
├── launch.json            # 调试配置
└── tasks.json             # 任务配置
```

## 🔧 配置说明

### package.json
- `main`: 插件入口文件
- `activationEvents`: 插件激活事件
- `contributes`: 插件贡献点（命令、视图等）

### launch.json
- 调试配置
- 使用 `npm: build` 作为预启动任务

### tasks.json
- 构建任务配置
- 支持TypeScript编译和问题匹配

## 🐛 常见问题

### 问题1: 构建失败
```bash
# 解决方案
npm run clean
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

## 📦 发布流程

### 1. 准备发布
```bash
# 更新版本号
npm version patch  # 或 minor, major

# 构建插件
npm run build

# 运行测试
npm test
```

### 2. 打包插件
```bash
npm run package
```

### 3. 安装插件
```bash
# 安装本地包
code --install-extension higgs-audio-vscode-extension-1.0.0.vsix
```

## 🎯 最佳实践

### 开发建议
1. **使用TypeScript**: 提供更好的类型安全
2. **模块化设计**: 将功能分解为独立的模块
3. **错误处理**: 完善的错误处理和用户提示
4. **性能优化**: 避免阻塞主线程
5. **测试覆盖**: 编写单元测试和集成测试

### 代码规范
1. **命名规范**: 使用清晰的变量和函数名
2. **注释**: 为复杂逻辑添加注释
3. **类型定义**: 使用TypeScript类型定义
4. **代码格式化**: 使用Prettier格式化代码

## 📚 相关资源

- [VSCode Extension API](https://code.visualstudio.com/api)
- [VSCode Extension Samples](https://github.com/Microsoft/vscode-extension-samples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**🎉 现在您可以使用标准的npm脚本开发VSCode插件了！**
