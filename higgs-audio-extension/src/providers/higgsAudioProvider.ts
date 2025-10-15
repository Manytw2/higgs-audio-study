import * as vscode from 'vscode';

export class HiggsAudioProvider implements vscode.TreeDataProvider<HiggsAudioItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<HiggsAudioItem | undefined | null | void> = new vscode.EventEmitter<HiggsAudioItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<HiggsAudioItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private items: HiggsAudioItem[] = [];

    constructor() {
        this.refresh();
    }

    refresh(): void {
        this.items = [
            new HiggsAudioItem('🎤 语音聊天', 'openChat', vscode.TreeItemCollapsibleState.None),
            new HiggsAudioItem('🎵 音频历史', 'audioHistory', vscode.TreeItemCollapsibleState.Collapsed),
            new HiggsAudioItem('🎭 语音库', 'voiceLibrary', vscode.TreeItemCollapsibleState.Collapsed),
            new HiggsAudioItem('⚙️ 设置', 'settings', vscode.TreeItemCollapsibleState.None),
        ];
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HiggsAudioItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: HiggsAudioItem): Thenable<HiggsAudioItem[]> {
        if (!element) {
            return Promise.resolve(this.items);
        }

        switch (element.command) {
            case 'audioHistory':
                return Promise.resolve([
                    new HiggsAudioItem('📁 今天的对话', 'todayHistory', vscode.TreeItemCollapsibleState.None),
                    new HiggsAudioItem('📁 本周对话', 'weekHistory', vscode.TreeItemCollapsibleState.None),
                    new HiggsAudioItem('📁 所有历史', 'allHistory', vscode.TreeItemCollapsibleState.None),
                ]);
            case 'voiceLibrary':
                return Promise.resolve([
                    new HiggsAudioItem('👤 默认男声', 'defaultMale', vscode.TreeItemCollapsibleState.None),
                    new HiggsAudioItem('👩 默认女声', 'defaultFemale', vscode.TreeItemCollapsibleState.None),
                    new HiggsAudioItem('➕ 添加语音', 'addVoice', vscode.TreeItemCollapsibleState.None),
                ]);
            default:
                return Promise.resolve([]);
        }
    }
}

export class HiggsAudioItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly command: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly iconPath?: vscode.ThemeIcon
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.command = {
            command: `higgsAudio.${command}`,
            title: this.label,
            arguments: [this]
        };
    }
}
