# 📁 项目结构说明

## 🏗️ 清理后的项目结构

```
higgs-audio-extension/
├── src/                          # 源代码目录
│   ├── extension.ts              # 主入口文件
│   └── providers/                # 视图提供者
│       └── higgsAudioProvider.ts # 侧边栏树形视图提供者
├── out/                          # 编译输出目录
│   ├── extension.js              # 编译后的主文件
│   ├── extension.js.map          # 源映射文件
│   └── providers/                # 编译后的提供者
│       ├── higgsAudioProvider.js
│       └── higgsAudioProvider.js.map
├── package.json                  # 插件配置和依赖
├── tsconfig.json                 # TypeScript配置
├── launch.json                   # VSCode调试配置
├── tasks.json                    # VSCode任务配置
├── README.md                     # 项目说明文档
├── DEMO.md                       # 功能演示文档
├── DEVELOPMENT_GUIDE.md          # 开发指南
├── NPM_START_GUIDE.md            # npm启动指南
└── PROJECT_STRUCTURE.md          # 项目结构说明（本文件）
```

## 📋 文件说明

### 核心文件
- **`src/extension.ts`**: 插件主入口，包含激活和停用逻辑
- **`src/providers/higgsAudioProvider.ts`**: 侧边栏树形视图提供者
- **`package.json`**: 插件配置、依赖和脚本定义
- **`tsconfig.json`**: TypeScript编译配置

### 配置文件
- **`launch.json`**: VSCode调试配置，支持F5启动
- **`tasks.json`**: VSCode任务配置，支持npm脚本集成

### 文档文件
- **`README.md`**: 项目概述和安装说明
- **`DEMO.md`**: 功能演示和使用示例
- **`DEVELOPMENT_GUIDE.md`**: 完整的开发指南
- **`NPM_START_GUIDE.md`**: npm脚本使用指南

## 🗑️ 已删除的文件

### 测试和简化版本
- `src/extension-minimal.ts` - 最简化版本
- `src/extension-simple.ts` - 简化版本
- `package-minimal.json` - 最简化配置
- `launch-minimal.json` - 最简化启动配置
- `launch-simple.json` - 简化启动配置

### 测试脚本
- `test-extension.js` - 插件测试脚本
- `test-f5.js` - F5调试测试脚本
- `start-dev.js` - 开发启动脚本

### 重复文档
- `QUICK_START.md` - 快速启动指南（功能重复）
- `START_HERE.md` - 启动指南（功能重复）
- `FINAL_START_GUIDE.md` - 最终启动指南（功能重复）
- `TEST_F5.md` - F5测试指南（功能重复）

### 未使用的功能模块
- `src/python/` - Python服务器相关代码
- `src/webview/` - Webview聊天界面代码
- `scripts/` - Python启动脚本
- `test/` - API测试脚本
- `install.py` - Python依赖安装脚本

### 未使用的依赖
- `axios` - HTTP客户端库
- `form-data` - 表单数据处理
- `@types/form-data` - form-data类型定义

## 🎯 当前功能

### 已实现功能
- ✅ 基本的VSCode插件框架
- ✅ 命令注册和执行
- ✅ 侧边栏树形视图
- ✅ 简单的Webview界面
- ✅ 标准的npm构建流程

### 核心命令
- `higgsAudio.openChat` - 打开聊天界面
- `higgsAudio.generateAudio` - 生成音频
- `higgsAudio.uploadVoice` - 上传语音样本

## 🚀 开发流程

### 构建和调试
```bash
# 构建插件
npm run build

# 启动调试
# 在VSCode中按F5，选择"启动扩展"

# 开发模式
npm run watch
```

### 项目特点
- 🎯 **简洁**: 只保留必要的文件和功能
- 🔧 **标准**: 使用标准的VSCode插件开发流程
- 📚 **文档完整**: 提供详细的开发和使用指南
- 🛠️ **易于维护**: 清晰的项目结构和代码组织

---

**项目已清理完成，结构简洁明了，便于开发和维护！**
