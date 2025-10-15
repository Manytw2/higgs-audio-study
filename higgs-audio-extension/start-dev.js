#!/usr/bin/env node

/**
 * 开发启动脚本
 * 使用npm run build构建并启动VSCode插件开发模式
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Higgs Audio VSCode插件开发启动器');
console.log('=' * 50);

// 检查必要文件
const requiredFiles = [
    'package.json',
    'src/extension.ts',
    'tsconfig.json'
];

console.log('📋 检查项目文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - 文件不存在`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ 项目文件不完整，请检查项目结构');
    process.exit(1);
}

// 构建插件
console.log('\n🔨 构建插件...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 构建成功');
} catch (error) {
    console.log('❌ 构建失败');
    process.exit(1);
}

// 检查构建输出
console.log('\n📦 检查构建输出...');
const outDir = 'out';
if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    console.log(`✅ out目录存在，包含 ${files.length} 个文件`);
    
    if (files.includes('extension.js')) {
        console.log('✅ extension.js 已生成');
    } else {
        console.log('❌ extension.js 未找到');
        process.exit(1);
    }
} else {
    console.log('❌ out目录不存在');
    process.exit(1);
}

// 启动开发模式
console.log('\n🎯 启动开发模式...');
console.log('提示: 在VSCode中按F5启动调试，或运行 npm run dev');

// 提供启动选项
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\n是否现在启动VSCode开发模式? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        try {
            console.log('🚀 启动VSCode开发模式...');
            execSync('code --extensionDevelopmentPath=.', { stdio: 'inherit' });
            console.log('✅ VSCode已启动，请按F5开始调试');
        } catch (error) {
            console.log('❌ 启动VSCode失败，请手动运行: code --extensionDevelopmentPath=.');
        }
    } else {
        console.log('📝 手动启动步骤:');
        console.log('1. 在VSCode中打开此项目文件夹');
        console.log('2. 按F5键启动调试');
        console.log('3. 选择"启动扩展"配置');
        console.log('4. 等待Extension Development Host窗口打开');
    }
    
    rl.close();
});

console.log('\n📚 更多信息请查看 DEVELOPMENT_GUIDE.md');
