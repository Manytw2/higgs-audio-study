const fs = require('fs');
const path = require('path');

console.log('🔍 F5启动问题诊断工具\n');

// 检查关键文件
const filesToCheck = [
    'package.json',
    'launch.json', 
    'tasks.json',
    'tsconfig.json',
    'src/extension.ts',
    'out/extension.js'
];

console.log('📁 检查关键文件:');
filesToCheck.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    
    if (exists && file.endsWith('.json')) {
        try {
            const content = JSON.parse(fs.readFileSync(file, 'utf8'));
            console.log(`    📄 JSON格式正确`);
        } catch (e) {
            console.log(`    ❌ JSON格式错误: ${e.message}`);
        }
    }
});

// 检查package.json配置
console.log('\n📦 检查package.json配置:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log(`  main: ${packageJson.main || '❌ 未设置'}`);
    console.log(`  activationEvents: ${packageJson.activationEvents ? '✅ 已设置' : '❌ 未设置'}`);
    console.log(`  contributes: ${packageJson.contributes ? '✅ 已设置' : '❌ 未设置'}`);
    
    if (packageJson.scripts) {
        console.log(`  scripts.compile: ${packageJson.scripts.compile ? '✅ 已设置' : '❌ 未设置'}`);
    }
} catch (e) {
    console.log(`  ❌ 无法读取package.json: ${e.message}`);
}

// 检查launch.json配置
console.log('\n🚀 检查launch.json配置:');
try {
    const launchJson = JSON.parse(fs.readFileSync('launch.json', 'utf8'));
    
    if (launchJson.configurations && launchJson.configurations.length > 0) {
        const config = launchJson.configurations[0];
        console.log(`  name: ${config.name || '❌ 未设置'}`);
        console.log(`  type: ${config.type || '❌ 未设置'}`);
        console.log(`  request: ${config.request || '❌ 未设置'}`);
        console.log(`  preLaunchTask: ${config.preLaunchTask || '❌ 未设置'}`);
        console.log(`  outFiles: ${config.outFiles ? '✅ 已设置' : '❌ 未设置'}`);
    } else {
        console.log('  ❌ 没有找到配置');
    }
} catch (e) {
    console.log(`  ❌ 无法读取launch.json: ${e.message}`);
}

// 检查tasks.json配置
console.log('\n⚙️ 检查tasks.json配置:');
try {
    const tasksJson = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
    
    if (tasksJson.tasks && tasksJson.tasks.length > 0) {
        const compileTask = tasksJson.tasks.find(task => task.label === 'npm: compile');
        if (compileTask) {
            console.log('  ✅ 找到npm: compile任务');
            console.log(`    type: ${compileTask.type}`);
            console.log(`    script: ${compileTask.script}`);
        } else {
            console.log('  ❌ 没有找到npm: compile任务');
        }
    } else {
        console.log('  ❌ 没有找到任务');
    }
} catch (e) {
    console.log(`  ❌ 无法读取tasks.json: ${e.message}`);
}

// 检查编译输出
console.log('\n🔨 检查编译输出:');
if (fs.existsSync('out/extension.js')) {
    const stats = fs.statSync('out/extension.js');
    console.log(`  ✅ extension.js存在 (${stats.size} bytes)`);
    console.log(`  📅 最后修改: ${stats.mtime}`);
} else {
    console.log('  ❌ extension.js不存在');
}

// 检查TypeScript配置
console.log('\n📝 检查TypeScript配置:');
try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log(`  compilerOptions.outDir: ${tsconfig.compilerOptions?.outDir || '❌ 未设置'}`);
    console.log(`  compilerOptions.target: ${tsconfig.compilerOptions?.target || '❌ 未设置'}`);
    console.log(`  compilerOptions.module: ${tsconfig.compilerOptions?.module || '❌ 未设置'}`);
} catch (e) {
    console.log(`  ❌ 无法读取tsconfig.json: ${e.message}`);
}

console.log('\n🎯 诊断完成！');
console.log('\n💡 如果F5仍然无法启动，请尝试:');
console.log('  1. 在VSCode中打开 higgs-audio-extension 文件夹');
console.log('  2. 确保选择了正确的启动配置');
console.log('  3. 检查VSCode开发者控制台的错误信息');
console.log('  4. 尝试运行 npm run compile 手动编译');
