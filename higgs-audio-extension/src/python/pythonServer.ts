import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import axios, { AxiosInstance } from 'axios';

export interface AudioGenerationRequest {
    text: string;
    voice?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    forceAudioGen?: boolean;
}

export interface AudioGenerationResponse {
    audioData: string; // base64 encoded audio
    text: string;
    duration: number;
    samplingRate: number;
    success: boolean;
    error?: string;
}

export interface VoiceCloneRequest {
    audioFile: string;
    text: string;
    name: string;
}

export interface VoiceCloneResponse {
    success: boolean;
    voiceId?: string;
    error?: string;
}

export class PythonServer {
    private process: ChildProcess | null = null;
    private axiosInstance: AxiosInstance;
    private isRunning = false;
    private serverPort = 8765;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.axiosInstance = axios.create({
            baseURL: `http://localhost:${this.serverPort}`,
            timeout: 30000
        });
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            return;
        }

        const config = vscode.workspace.getConfiguration('higgsAudio');
        const pythonPath = this.getPythonPath();
        const serverScript = path.join(this.context.extensionPath, 'src', 'python', 'higgs_audio_server.py');

        return new Promise((resolve, reject) => {
            const args = [
                serverScript,
                '--port', this.serverPort.toString(),
                '--model-path', config.get('modelPath', 'bosonai/higgs-audio-v2-generation-3B-base'),
                '--audio-tokenizer-path', config.get('audioTokenizerPath', 'bosonai/higgs-audio-v2-tokenizer'),
                '--device', config.get('device', 'auto'),
                '--max-tokens', config.get('maxTokens', 1024).toString(),
                '--temperature', config.get('temperature', 0.3).toString(),
                '--top-p', config.get('topP', 0.95).toString()
            ];

            this.process = spawn(pythonPath, args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: this.context.extensionPath
            });

            this.process.stdout?.on('data', (data) => {
                const output = data.toString();
                console.log('Python Server:', output);
                if (output.includes('Server started')) {
                    this.isRunning = true;
                    resolve();
                }
            });

            this.process.stderr?.on('data', (data) => {
                console.error('Python Server Error:', data.toString());
            });

            this.process.on('error', (error) => {
                console.error('Failed to start Python server:', error);
                reject(error);
            });

            this.process.on('exit', (code) => {
                this.isRunning = false;
                if (code !== 0) {
                    console.error(`Python server exited with code ${code}`);
                }
            });

            // 超时处理
            setTimeout(() => {
                if (!this.isRunning) {
                    reject(new Error('Python server startup timeout'));
                }
            }, 60000); // 60秒超时
        });
    }

    async stop(): Promise<void> {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        this.isRunning = false;
    }

    async generateAudio(request: AudioGenerationRequest): Promise<AudioGenerationResponse> {
        try {
            const response = await this.axiosInstance.post('/generate', request);
            return response.data;
        } catch (error) {
            console.error('Audio generation failed:', error);
            return {
                audioData: '',
                text: '',
                duration: 0,
                samplingRate: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async cloneVoice(request: VoiceCloneRequest): Promise<VoiceCloneResponse> {
        try {
            // 在Node.js环境中，我们需要使用不同的方式处理文件上传
            const fs = require('fs');
            const FormData = require('form-data');
            
            const formData = new FormData();
            formData.append('audioFile', fs.createReadStream(request.audioFile));
            formData.append('text', request.text);
            formData.append('name', request.name);

            const response = await this.axiosInstance.post('/clone-voice', formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            return response.data;
        } catch (error) {
            console.error('Voice cloning failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getVoices(): Promise<string[]> {
        try {
            const response = await this.axiosInstance.get('/voices');
            return response.data.voices || [];
        } catch (error) {
            console.error('Failed to get voices:', error);
            return [];
        }
    }

    async getHistory(): Promise<any[]> {
        try {
            const response = await this.axiosInstance.get('/history');
            return response.data.history || [];
        } catch (error) {
            console.error('Failed to get history:', error);
            return [];
        }
    }

    reloadConfiguration(): void {
        // 重新加载配置，可能需要重启服务器
        if (this.isRunning) {
            this.stop().then(() => {
                setTimeout(() => this.start(), 1000);
            });
        }
    }

    private getPythonPath(): string {
        // 尝试从配置中获取Python路径
        const config = vscode.workspace.getConfiguration('python');
        const pythonPath = config.get<string>('pythonPath');
        
        if (pythonPath && fs.existsSync(pythonPath)) {
            return pythonPath;
        }

        // 尝试常见的Python路径
        const commonPaths = [
            'python',
            'python3',
            'py',
            'C:\\Python39\\python.exe',
            'C:\\Python310\\python.exe',
            'C:\\Python311\\python.exe',
            '/usr/bin/python3',
            '/usr/local/bin/python3'
        ];

        for (const path of commonPaths) {
            try {
                // 这里可以添加更复杂的路径检查逻辑
                return path;
            } catch (error) {
                continue;
            }
        }

        return 'python'; // 默认值
    }

    get isServerRunning(): boolean {
        return this.isRunning;
    }
}
