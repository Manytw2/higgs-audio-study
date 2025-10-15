// 最简化的VSCode插件，用于测试F5启动
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Higgs Audio extension is now active!');

    // 注册一个简单的命令
    const disposable = vscode.commands.registerCommand('higgsAudio.hello', () => {
        vscode.window.showInformationMessage('Hello from Higgs Audio!');
    });

    context.subscriptions.push(disposable);
    
    // 显示激活消息
    vscode.window.showInformationMessage('Higgs Audio插件已激活！');
}

export function deactivate() {
    console.log('Higgs Audio extension is now deactivated!');
}
