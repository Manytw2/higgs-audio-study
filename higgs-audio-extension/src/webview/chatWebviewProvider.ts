import * as vscode from 'vscode';
import * as path from 'path';
import { PythonServer, AudioGenerationRequest, VoiceCloneRequest } from '../python/pythonServer';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    audioData?: string;
    timestamp: string;
    isGenerating?: boolean;
}

export class ChatWebviewProvider implements vscode.Disposable {
    private panel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;
    private pythonServer: PythonServer;
    private chatHistory: ChatMessage[] = [];

    constructor(context: vscode.ExtensionContext, pythonServer: PythonServer) {
        this.context = context;
        this.pythonServer = pythonServer;
    }

    public openChat(): void {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Beside);
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'higgsAudioChat',
            'Higgs Audio 聊天',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
                    vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'webview'))
                ]
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        // 处理来自webview的消息
        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'generateAudio':
                        await this.handleGenerateAudio(message.text, message.voice);
                        break;
                    case 'uploadVoice':
                        await this.handleUploadVoice();
                        break;
                    case 'playAudio':
                        await this.handlePlayAudio(message.audioData);
                        break;
                    case 'downloadAudio':
                        await this.handleDownloadAudio(message.audioData, message.filename);
                        break;
                    case 'clearHistory':
                        this.clearHistory();
                        break;
                    case 'getHistory':
                        this.sendHistory();
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        }, null, this.context.subscriptions);

        // 发送初始历史记录
        this.sendHistory();
    }

    private async handleGenerateAudio(text: string, voice?: string): Promise<void> {
        if (!this.panel) return;

        // 添加用户消息
        const userMessage: ChatMessage = {
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };
        this.chatHistory.push(userMessage);

        // 添加生成中的助手消息
        const generatingMessage: ChatMessage = {
            role: 'assistant',
            content: '正在生成音频...',
            timestamp: new Date().toISOString(),
            isGenerating: true
        };
        this.chatHistory.push(generatingMessage);

        this.sendHistory();

        try {
            const request: AudioGenerationRequest = {
                text: text,
                voice: voice,
                temperature: vscode.workspace.getConfiguration('higgsAudio').get('temperature', 0.3),
                maxTokens: vscode.workspace.getConfiguration('higgsAudio').get('maxTokens', 1024),
                topP: vscode.workspace.getConfiguration('higgsAudio').get('topP', 0.95),
                forceAudioGen: true
            };

            const response = await this.pythonServer.generateAudio(request);

            if (response.success) {
                // 更新助手消息
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: response.text,
                    audioData: response.audioData,
                    timestamp: new Date().toISOString()
                };

                // 替换生成中的消息
                this.chatHistory[this.chatHistory.length - 1] = assistantMessage;

                // 自动播放音频
                const autoPlay = vscode.workspace.getConfiguration('higgsAudio').get('autoPlay', true);
                if (autoPlay) {
                    this.panel.webview.postMessage({
                        command: 'playAudio',
                        audioData: response.audioData
                    });
                }
            } else {
                // 显示错误消息
                const errorMessage: ChatMessage = {
                    role: 'assistant',
                    content: `生成失败: ${response.error}`,
                    timestamp: new Date().toISOString()
                };
                this.chatHistory[this.chatHistory.length - 1] = errorMessage;
            }

            this.sendHistory();
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: `生成失败: ${error instanceof Error ? error.message : '未知错误'}`,
                timestamp: new Date().toISOString()
            };
            this.chatHistory[this.chatHistory.length - 1] = errorMessage;
            this.sendHistory();
        }
    }

    private async handleUploadVoice(): Promise<void> {
        const fileUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectMany: false,
            filters: {
                'Audio Files': ['wav', 'mp3', 'flac', 'm4a']
            }
        });

        if (!fileUris || fileUris.length === 0) {
            return;
        }

        const audioFile = fileUris[0].fsPath;
        const name = await vscode.window.showInputBox({
            prompt: '请输入语音名称',
            placeHolder: '例如: 我的声音'
        });

        if (!name) {
            return;
        }

        const text = await vscode.window.showInputBox({
            prompt: '请输入对应的文本内容',
            placeHolder: '例如: 你好，这是我的声音样本'
        });

        if (!text) {
            return;
        }

        try {
            const request: VoiceCloneRequest = {
                audioFile: audioFile,
                text: text,
                name: name
            };

            const response = await this.pythonServer.cloneVoice(request);

            if (response.success) {
                vscode.window.showInformationMessage(`语音克隆成功: ${name}`);
            } else {
                vscode.window.showErrorMessage(`语音克隆失败: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`语音克隆失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }

    private async handlePlayAudio(audioData: string): Promise<void> {
        // 这里可以实现音频播放逻辑
        // 由于VSCode webview的限制，我们通过消息传递给前端处理
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'playAudio',
                audioData: audioData
            });
        }
    }

    private async handleDownloadAudio(audioData: string, filename: string): Promise<void> {
        try {
            const fileUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(filename),
                filters: {
                    'Audio Files': ['wav']
                }
            });

            if (!fileUri) {
                return;
            }

            // 将base64数据转换为Buffer并保存
            const buffer = Buffer.from(audioData, 'base64');
            await vscode.workspace.fs.writeFile(fileUri, buffer);

            vscode.window.showInformationMessage(`音频已保存到: ${fileUri.fsPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }

    private clearHistory(): void {
        this.chatHistory = [];
        this.sendHistory();
    }

    private sendHistory(): void {
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'updateHistory',
                history: this.chatHistory
            });
        }
    }

    public generateAudioFromText(text: string): void {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Beside);
            this.handleGenerateAudio(text);
        } else {
            this.openChat();
            // 等待webview加载完成后再发送消息
            setTimeout(() => {
                this.handleGenerateAudio(text);
            }, 1000);
        }
    }

    public uploadVoiceSample(): void {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Beside);
            this.handleUploadVoice();
        } else {
            this.openChat();
            setTimeout(() => {
                this.handleUploadVoice();
            }, 1000);
        }
    }

    private getWebviewContent(): string {
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
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }

        .controls {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 6px 12px;
            border: 1px solid var(--vscode-button-border);
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }

        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 20px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
            padding: 10px;
        }

        .message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 5px;
        }

        .message.user {
            background-color: var(--vscode-input-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
        }

        .message.assistant {
            background-color: var(--vscode-editor-background);
            border-left: 3px solid var(--vscode-textPreformat-foreground);
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        .message-content {
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .audio-player {
            margin-top: 10px;
        }

        .audio-controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .audio-btn {
            padding: 4px 8px;
            border: 1px solid var(--vscode-button-border);
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .audio-btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .input-container {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }

        .input-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .text-input {
            width: 100%;
            min-height: 60px;
            padding: 10px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
            resize: vertical;
            font-family: inherit;
            font-size: inherit;
        }

        .text-input:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .input-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .voice-upload {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid var(--vscode-progressBar-background);
            border-radius: 50%;
            border-top-color: var(--vscode-progressBar-foreground);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .empty-state {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            padding: 40px 20px;
        }

        .empty-state h3 {
            margin-bottom: 10px;
            color: var(--vscode-foreground);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">🎤 Higgs Audio 聊天</div>
        <div class="controls">
            <button class="btn" onclick="clearHistory()">清空历史</button>
            <button class="btn" onclick="uploadVoice()">上传语音</button>
        </div>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="empty-state">
            <h3>欢迎使用 Higgs Audio！</h3>
            <p>输入文本，我将为您生成语音</p>
        </div>
    </div>

    <div class="input-container">
        <div class="input-area">
            <textarea 
                class="text-input" 
                id="textInput" 
                placeholder="输入要转换为语音的文本..."
                rows="3"
            ></textarea>
            <div class="input-controls">
                <div class="voice-upload">
                    <button class="btn" onclick="uploadVoice()">🎤 上传语音样本</button>
                </div>
                <div>
                    <button class="btn" onclick="clearInput()">清空</button>
                    <button class="btn" id="sendBtn" onclick="sendMessage()">发送</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let chatHistory = [];
        let isGenerating = false;

        // 发送消息
        function sendMessage() {
            const textInput = document.getElementById('textInput');
            const text = textInput.value.trim();
            
            if (!text || isGenerating) {
                return;
            }

            isGenerating = true;
            updateSendButton();

            vscode.postMessage({
                command: 'generateAudio',
                text: text
            });

            textInput.value = '';
        }

        // 清空输入
        function clearInput() {
            document.getElementById('textInput').value = '';
        }

        // 清空历史
        function clearHistory() {
            vscode.postMessage({
                command: 'clearHistory'
            });
        }

        // 上传语音
        function uploadVoice() {
            vscode.postMessage({
                command: 'uploadVoice'
            });
        }

        // 播放音频
        function playAudio(audioData) {
            const audio = new Audio('data:audio/wav;base64,' + audioData);
            audio.play().catch(e => console.error('Audio play failed:', e));
        }

        // 下载音频
        function downloadAudio(audioData, filename) {
            vscode.postMessage({
                command: 'downloadAudio',
                audioData: audioData,
                filename: filename
            });
        }

        // 更新发送按钮状态
        function updateSendButton() {
            const sendBtn = document.getElementById('sendBtn');
            if (isGenerating) {
                sendBtn.innerHTML = '<div class="loading"></div>';
                sendBtn.disabled = true;
            } else {
                sendBtn.innerHTML = '发送';
                sendBtn.disabled = false;
            }
        }

        // 渲染聊天历史
        function renderChat() {
            const container = document.getElementById('chatContainer');
            
            if (chatHistory.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <h3>欢迎使用 Higgs Audio！</h3>
                        <p>输入文本，我将为您生成语音</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = chatHistory.map(msg => {
                const timestamp = new Date(msg.timestamp).toLocaleTimeString();
                const isUser = msg.role === 'user';
                
                let audioControls = '';
                if (msg.audioData && !msg.isGenerating) {
                    audioControls = \`
                        <div class="audio-player">
                            <div class="audio-controls">
                                <button class="audio-btn" onclick="playAudio('\${msg.audioData}')">▶️ 播放</button>
                                <button class="audio-btn" onclick="downloadAudio('\${msg.audioData}', 'audio_\${Date.now()}.wav')">💾 下载</button>
                            </div>
                        </div>
                    \`;
                }

                if (msg.isGenerating) {
                    audioControls = \`
                        <div class="audio-player">
                            <div class="loading"></div> 正在生成音频...
                        </div>
                    \`;
                }

                return \`
                    <div class="message \${isUser ? 'user' : 'assistant'}">
                        <div class="message-header">
                            <span>\${isUser ? '👤 您' : '🤖 AI助手'}</span>
                            <span>\${timestamp}</span>
                        </div>
                        <div class="message-content">\${msg.content}</div>
                        \${audioControls}
                    </div>
                \`;
            }).join('');
            
            // 滚动到底部
            container.scrollTop = container.scrollHeight;
        }

        // 监听来自扩展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateHistory':
                    chatHistory = message.history;
                    renderChat();
                    isGenerating = false;
                    updateSendButton();
                    break;
                case 'playAudio':
                    playAudio(message.audioData);
                    break;
            }
        });

        // 监听回车键发送
        document.getElementById('textInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 初始化
        updateSendButton();
    </script>
</body>
</html>`;
    }

    public dispose(): void {
        if (this.panel) {
            this.panel.dispose();
        }
    }
}
