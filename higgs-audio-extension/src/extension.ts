import * as vscode from 'vscode';
import { HiggsAudioProvider } from './providers/higgsAudioProvider';
import { PythonServer } from './python/pythonServer';
import { ChatWebviewProvider } from './webview/chatWebviewProvider';

let pythonServer: PythonServer;
let chatProvider: ChatWebviewProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('Higgs Audio extension is now active!');

    // 初始化Python服务器
    pythonServer = new PythonServer(context);
    
    // 初始化聊天Webview提供者
    chatProvider = new ChatWebviewProvider(context, pythonServer);

    // 注册命令
    const openChatCommand = vscode.commands.registerCommand('higgsAudio.openChat', () => {
        chatProvider.openChat();
    });

    const generateAudioCommand = vscode.commands.registerCommand('higgsAudio.generateAudio', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.document.getText(editor.selection);
            if (selection) {
                chatProvider.generateAudioFromText(selection);
            } else {
                vscode.window.showWarningMessage('请先选择要转换的文本');
            }
        }
    });

    const uploadVoiceCommand = vscode.commands.registerCommand('higgsAudio.uploadVoice', () => {
        chatProvider.uploadVoiceSample();
    });

    // 注册视图提供者
    const higgsAudioProvider = new HiggsAudioProvider();
    vscode.window.registerTreeDataProvider('higgsAudioChat', higgsAudioProvider);

    // 注册配置变化监听
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('higgsAudio')) {
            pythonServer.reloadConfiguration();
        }
    });

    // 添加到订阅列表
    context.subscriptions.push(
        openChatCommand,
        generateAudioCommand,
        uploadVoiceCommand,
        configChangeListener,
        chatProvider
    );

    // 启动Python服务器
    pythonServer.start().then(() => {
        vscode.window.showInformationMessage('Higgs Audio服务器已启动');
    }).catch((error) => {
        vscode.window.showErrorMessage(`启动Higgs Audio服务器失败: ${error.message}`);
    });
}

export function deactivate() {
    if (pythonServer) {
        pythonServer.stop();
    }
    if (chatProvider) {
        chatProvider.dispose();
    }
}
