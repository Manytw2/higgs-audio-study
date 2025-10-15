import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Higgs Audio extension is now active!');

    // 注册一个简单的命令
    const openChatCommand = vscode.commands.registerCommand('higgsAudio.openChat', () => {
        vscode.window.showInformationMessage('Higgs Audio聊天功能正在开发中...');
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
