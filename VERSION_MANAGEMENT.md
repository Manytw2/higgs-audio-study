# Higgs Audio 项目版本管理

## 🌿 分支策略

### 主要分支

- **`main`**: 主分支，包含稳定的生产代码
- **`develop`**: 开发分支，用于集成新功能
- **`feature/*`**: 功能分支，用于开发新特性
- **`hotfix/*`**: 热修复分支，用于紧急修复
- **`release/*`**: 发布分支，用于准备新版本

### 当前分支

- **`feature/vscode-extension`**: VSCode插件开发分支
  - 包含完整的VSCode扩展实现
  - 支持文本转语音和语音克隆功能
  - 版本: v1.0.0-extension

## 📋 版本标签

### 已发布版本

- **`v1.0.0-extension`**: Higgs Audio VSCode Extension 首个版本
  - 发布日期: 2025-01-15
  - 功能: 完整的VSCode插件架构和核心功能

### 版本命名规范

- **主版本**: `v1.0.0` - 重大功能更新
- **次版本**: `v1.1.0` - 新功能添加
- **修订版本**: `v1.0.1` - 错误修复
- **预发布版本**: `v1.0.0-alpha.1` - 内部测试版本
- **扩展版本**: `v1.0.0-extension` - 特定组件版本

## 🔄 工作流程

### 1. 功能开发流程

```bash
# 1. 从develop分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交更改
git add .
git commit -m "feat: 添加新功能描述"

# 4. 推送分支
git push -u origin feature/new-feature

# 5. 创建Pull Request到develop分支
```

### 2. 发布流程

```bash
# 1. 从develop创建发布分支
git checkout develop
git checkout -b release/v1.1.0

# 2. 准备发布
# - 更新版本号
# - 更新CHANGELOG
# - 测试验证

# 3. 合并到main和develop
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags

git checkout develop
git merge release/v1.1.0
git push origin develop

# 4. 删除发布分支
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### 3. 热修复流程

```bash
# 1. 从main分支创建热修复分支
git checkout main
git checkout -b hotfix/critical-bug-fix

# 2. 修复问题
# ... 修复代码 ...

# 3. 提交修复
git add .
git commit -m "fix: 修复关键问题描述"

# 4. 合并到main和develop
git checkout main
git merge hotfix/critical-bug-fix
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin main --tags

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# 5. 删除热修复分支
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

## 📝 提交信息规范

### 提交类型

- **`feat`**: 新功能
- **`fix`**: 错误修复
- **`docs`**: 文档更新
- **`style`**: 代码格式调整
- **`refactor`**: 代码重构
- **`test`**: 测试相关
- **`chore`**: 构建过程或辅助工具的变动

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```
feat(extension): 添加语音克隆功能

- 支持上传音频样本
- 实现声音特征提取
- 添加语音库管理

Closes #123
```

## 🏷️ 标签管理

### 创建标签

```bash
# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签到远程
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

### 查看标签

```bash
# 查看所有标签
git tag

# 查看标签详情
git show v1.0.0

# 查看标签历史
git log --oneline --decorate --graph
```

## 📊 版本历史

### v1.0.0-extension (2025-01-15)
- ✅ 完整的VSCode插件架构
- ✅ 文本转语音功能
- ✅ 语音克隆功能
- ✅ 现代化聊天界面
- ✅ 完整的文档和测试

### 计划版本

### v1.1.0 (计划中)
- 🔄 多语言支持
- 🔄 批量处理功能
- 🔄 高级音频编辑
- 🔄 云端模型支持

### v1.2.0 (计划中)
- 🔄 实时语音合成
- 🔄 语音情感分析
- 🔄 自定义语音训练
- 🔄 插件市场发布

## 🔧 工具和命令

### 常用Git命令

```bash
# 查看分支状态
git branch -a

# 查看提交历史
git log --oneline --graph --all

# 查看文件变更
git diff

# 查看暂存区状态
git status

# 撤销更改
git checkout -- <file>
git reset HEAD <file>

# 合并分支
git merge <branch-name>

# 变基操作
git rebase <branch-name>
```

### 版本管理工具

- **Git**: 版本控制
- **GitHub**: 代码托管和协作
- **GitHub Actions**: CI/CD自动化
- **Semantic Versioning**: 版本号规范

## 📋 检查清单

### 发布前检查

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG已更新
- [ ] 代码审查完成
- [ ] 性能测试通过
- [ ] 兼容性测试通过

### 合并前检查

- [ ] 功能完整实现
- [ ] 单元测试覆盖
- [ ] 集成测试通过
- [ ] 代码风格一致
- [ ] 无安全漏洞
- [ ] 性能影响评估

## 🚀 快速开始

### 克隆项目

```bash
git clone https://github.com/Manytw2/higgs-audio-study.git
cd higgs-audio-study
```

### 查看当前分支

```bash
git branch
```

### 切换到功能分支

```bash
git checkout feature/vscode-extension
```

### 查看版本标签

```bash
git tag -l
```

## 📞 支持

如有版本管理相关问题，请：

1. 查看本文档
2. 提交Issue到GitHub
3. 联系项目维护者

---

**最后更新**: 2025-01-15  
**维护者**: Higgs Audio Team
