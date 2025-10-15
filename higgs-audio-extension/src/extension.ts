import * as vscode from 'vscode';
import { HiggsAudioProvider } from './providers/higgsAudioProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Higgs Audio extension is now active!');

    // 注册命令
    const openChatCommand = vscode.commands.registerCommand('higgsAudio.openChat', () => {
        vscode.window.showInformationMessage('Higgs Audio聊天功能正在开发中...');
        
        // 创建简单的webview
        const panel = vscode.window.createWebviewPanel(
            'higgsAudioChat',
            'Higgs Audio 聊天',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebviewContent();
    });

    const generateAudioCommand = vscode.commands.registerCommand('higgsAudio.generateAudio', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.document.getText(editor.selection);
            if (selection) {
                vscode.window.showInformationMessage(`准备为以下文本生成音频:\n${selection}`);
            } else {
                vscode.window.showWarningMessage('请先选择要转换的文本');
            }
        }
    });

    const uploadVoiceCommand = vscode.commands.registerCommand('higgsAudio.uploadVoice', () => {
        vscode.window.showInformationMessage('语音克隆功能正在开发中...');
    });

    // 注册视图提供者
    const higgsAudioProvider = new HiggsAudioProvider();
    vscode.window.registerTreeDataProvider('higgsAudioChat', higgsAudioProvider);

    // 添加到订阅列表
    context.subscriptions.push(
        openChatCommand,
        generateAudioCommand,
        uploadVoiceCommand
    );

    vscode.window.showInformationMessage('Higgs Audio插件已激活！');
}

export function deactivate() {
    console.log('Higgs Audio extension is now deactivated!');
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Higgs Audio 聊天</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 10px;
        }
        .subtitle {
            color: var(--vscode-descriptionForeground);
        }
        .feature-list {
            list-style: none;
            padding: 0;
        }
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .feature-list li:before {
            content: "🎤 ";
            margin-right: 10px;
        }
        .status {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background-color: var(--vscode-input-background);
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">🎤 Higgs Audio</div>
        <div class="subtitle">AI语音生成助手</div>
    </div>
    
    <h3>功能特性</h3>
    <ul class="feature-list">
        <li>文本转语音</li>
        <li>语音克隆</li>
        <li>智能对话</li>
        <li>音频播放</li>
        <li>历史记录</li>
    </ul>
    
    <div class="status">
        <h3>✅ 插件已成功激活</h3>
        <p>Higgs Audio VSCode插件正在运行中...</p>
        <p>更多功能正在开发中，敬请期待！</p>
    </div>
</body>
</html>`;
}
