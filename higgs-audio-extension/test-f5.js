#!/usr/bin/env node

/**
 * F5调试测试脚本
 * 检查VSCode插件是否可以正常启动
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 F5调试测试');
console.log('=' * 40);

// 检查必要文件
const requiredFiles = [
    'package.json',
    'launch.json',
    'out/extension.js',
    'out/extension-minimal.js'
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
    
    // 检查关键字段
    const checks = [
        { field: 'name', value: packageJson.name },
        { field: 'main', value: packageJson.main },
        { field: 'engines.vscode', value: packageJson.engines?.vscode },
        { field: 'activationEvents', value: packageJson.activationEvents },
        { field: 'contributes.commands', value: packageJson.contributes?.commands }
    ];
    
    checks.forEach(check => {
        if (check.value) {
            console.log(`✅ ${check.field}: ${JSON.stringify(check.value)}`);
        } else {
            console.log(`❌ ${check.field} - 字段缺失或为空`);
            allFilesExist = false;
        }
    });
} catch (error) {
    console.log(`❌ package.json解析失败: ${error.message}`);
    allFilesExist = false;
}

// 检查launch.json配置
console.log('\n🚀 检查launch.json配置...');
try {
    const launchJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'launch.json'), 'utf8'));
    
    if (launchJson.configurations && launchJson.configurations.length > 0) {
        const config = launchJson.configurations[0];
        console.log(`✅ 配置数量: ${launchJson.configurations.length}`);
        console.log(`✅ 配置名称: ${config.name}`);
        console.log(`✅ 配置类型: ${config.type}`);
        console.log(`✅ 请求类型: ${config.request}`);
    } else {
        console.log('❌ launch.json配置为空');
        allFilesExist = false;
    }
} catch (error) {
    console.log(`❌ launch.json解析失败: ${error.message}`);
    allFilesExist = false;
}

// 检查编译输出
console.log('\n🔨 检查编译输出...');
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    console.log(`✅ out目录存在，包含 ${files.length} 个文件`);
    
    // 检查主要的JS文件
    const mainFiles = ['extension.js', 'extension-minimal.js'];
    mainFiles.forEach(file => {
        if (files.includes(file)) {
            const filePath = path.join(outDir, file);
            const stats = fs.statSync(filePath);
            console.log(`   ✅ ${file} (${stats.size} bytes)`);
        } else {
            console.log(`   ❌ ${file} - 文件不存在`);
            allFilesExist = false;
        }
    });
} else {
    console.log('❌ out目录不存在，需要先编译');
    allFilesExist = false;
}

// 总结
console.log('\n' + '=' * 40);
if (allFilesExist) {
    console.log('🎉 所有检查通过！F5应该可以正常工作');
    console.log('\n下一步:');
    console.log('1. 在VSCode中打开 higgs-audio-extension 文件夹');
    console.log('2. 按 F5 启动调试');
    console.log('3. 应该会打开新的Extension Development Host窗口');
    console.log('4. 在新窗口中按 Ctrl+Shift+P 测试命令');
} else {
    console.log('⚠️  发现问题，请先解决上述问题');
    console.log('\n建议:');
    console.log('1. 运行 npm run compile 编译代码');
    console.log('2. 检查所有必要文件是否存在');
    console.log('3. 查看 TEST_F5.md 获取详细指导');
}

console.log('\n📚 更多信息请查看 TEST_F5.md');
