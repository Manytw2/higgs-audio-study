#!/usr/bin/env node

/**
 * 简单的插件测试脚本
 * 用于验证插件的基本功能
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Higgs Audio VSCode插件测试');
console.log('=' * 40);

// 检查必要文件
const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/extension.ts',
    'out/extension.js'
];

console.log('📋 检查必要文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - 文件不存在`);
        allFilesExist = false;
    }
});

// 检查package.json配置
console.log('\n📦 检查package.json配置...');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    const requiredFields = ['name', 'version', 'engines', 'main', 'contributes'];
    requiredFields.forEach(field => {
        if (packageJson[field]) {
            console.log(`✅ ${field}: ${JSON.stringify(packageJson[field])}`);
        } else {
            console.log(`❌ ${field} - 字段缺失`);
            allFilesExist = false;
        }
    });
} catch (error) {
    console.log(`❌ package.json解析失败: ${error.message}`);
    allFilesExist = false;
}

// 检查编译输出
console.log('\n🔨 检查编译输出...');
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    console.log(`✅ out目录存在，包含 ${files.length} 个文件`);
    files.forEach(file => {
        console.log(`   - ${file}`);
    });
} else {
    console.log('❌ out目录不存在，需要先编译');
    allFilesExist = false;
}

// 总结
console.log('\n' + '=' * 40);
if (allFilesExist) {
    console.log('🎉 所有检查通过！插件应该可以正常运行');
    console.log('\n下一步:');
    console.log('1. 在VSCode中打开 higgs-audio-extension 文件夹');
    console.log('2. 按 F5 启动调试');
    console.log('3. 在新窗口中测试插件功能');
} else {
    console.log('⚠️  发现问题，请先解决上述问题');
    console.log('\n建议:');
    console.log('1. 运行 npm install 安装依赖');
    console.log('2. 运行 npm run compile 编译代码');
    console.log('3. 检查所有必要文件是否存在');
}

console.log('\n📚 更多信息请查看 QUICK_START.md');
