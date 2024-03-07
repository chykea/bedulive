<template>
    <span>当前语言：</span>
    <el-select v-model="language" class="m-2" placeholder="请选择类型" size="large" style="width: 120px"
        @change="changeLanguage">
        <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <span>当前主题：</span>
    <el-select v-model="theme" class="m-2" placeholder="请选择主题" size="large" style="width: 120px" @change="changeTheme">
        <el-option v-for="item in themeOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <span>当前字体大小：</span>
    <el-popover placement="top" width="400" trigger="click">
        <el-slider v-model="fontSize" :min="12" :max=30 @change="changeFontSize"></el-slider>
        <template #reference>
            <el-button class="custom-el-btn-color"><i>{{ fontSize + 'px' }}</i></el-button>
        </template>
    </el-popover>
    <el-button @click="changeMinimap" class="custom-el-btn-color" plain>minimap</el-button>
    <el-button @click="showImport = true" class="custom-el-btn-color" plain>导入</el-button>
    <el-button @click="exportFile" class="custom-el-btn-color" plain>导出</el-button>

    <div id="codeEditBox"></div>
    <el-dialog v-model="showImport">
        <el-upload class="upload-demo" :show-file-list="false" :auto-upload="false" :on-change="importFile" drag
            accept=".js,text/html,.css,.ts,.json">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽文件到这里 <em>点击上传</em>
            </div>

            <template #tip>
                <div class="el-upload__tip">
                    只能上传html/css/js/json文件
                </div>
            </template>
        </el-upload>
    </el-dialog>
</template>


<script setup>
// 个人版编辑器
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor';
import { nextTick, ref, onBeforeUnmount, } from 'vue'
import { debounce } from '../../utils/util'
import { ElMessage } from 'element-plus'

const language = ref('javascript')
const theme = ref('vs')
const fontSize = ref(16)
const code = ref('')

const languageOptions = [
    {
        value: 'html',
        label: 'html',
    },
    {
        value: 'css',
        label: 'css',
    },
    {
        value: 'javascript',
        label: 'javascript',
    },
    {
        value: 'typescript',
        label: 'typescript',
    },
    {
        value: 'json',
        label: 'json',
    },
]


const themeOptions = [
    {
        value: 'vs',
        label: 'vs',
    },
    {
        value: 'vs-dark',
        label: 'vs-dark',
    },
    {
        value: 'hc-black',
        label: 'hc-black',
    },
]

onBeforeUnmount(() => {
    editor.dispose()
})

// 在window中注册MonacoEnvironment
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (['typescript', 'javascript'].includes(label)) {
            return new tsWorker()
        }
        return new EditorWorker()
    },
}

let editor;

const editorInit = () => {
    nextTick(() => {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2016,
            allowNonTsExtensions: true
        });

        !editor ? editor = monaco.editor.create(document.getElementById('codeEditBox'), {
            value: "", // 编辑器初始显示文字
            language: 'javascript', // 语言支持自行查阅demo
            automaticLayout: true, // 自适应布局  
            theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
            foldingStrategy: 'indentation',
            renderLineHighlight: 'all', // 行亮
            selectOnLineNumbers: true, // 显示行号
            minimap: {
                enabled: false,
            },
            readOnly: false, // 控制只读
            fontSize: 16, // 字体大小
            scrollBeyondLastLine: false, // 取消代码后面一大段空白 
            overviewRulerBorder: false, // 不要滚动条的边框  
        }) :
            editor.setValue("");
        editor.onDidChangeModelContent(debounce((val) => {
            code.value = editor.getValue()
        }))
    })
}
editorInit()
const historyMap = new Map()
const changeLanguage = (language) => {
    // 存储当前语言编辑的代码
    historyMap.set(editor.getModel().getLanguageIdAtPosition(), editor.getValue())
    monaco.editor.setModelLanguage(editor.getModel(), language)
    // 清除/回显代码
    historyMap.get(language) ? editor.setValue(historyMap.get(language)) : editor.setValue('')
}
const changeTheme = (theme) => {
    monaco.editor.setTheme(theme)
}
const changeFontSize = (fontSize) => {
    editor.updateOptions({ fontSize })
}
const changeMinimap = () => {
    editor.updateOptions({
        minimap: {
            enabled: !editor.getOption(monaco.editor.EditorOption.minimap).enabled
        }
    })
}

// 导出代码
const getExtensionFromLanguage = (extension) => {
    switch (extension) {
        case 'javascript':
            return 'js';
        case 'typescript':
            return 'ts'
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        default:
            return 'plaintext'; // 默认设置为纯文本
    }
}
const showImport = ref(false);

const exportFile = () => {
    if (code.value === '') {
        ElMessage({
            message: '没有可导出的内容',
            type: 'warning',
            duration: 1000
        })
        return
    }
    var blob = new Blob([code.value], { type: 'text/plain' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'code.' + getExtensionFromLanguage(language.value); // 文件名为 code.语言后缀
    a.click();
    window.URL.revokeObjectURL(url);
}

// 导入代码
const importFile = (file) => {
    var postfix = getFileExtension(file.name);
    if (!['html', 'css', 'js', 'json'].includes(getFileExtension(postfix))) {
        ElMessage({
            message: '不支持的文件格式',
            type: 'error',
            duration: 1000
        })
        return
    }
    const reader = new FileReader();
    reader.readAsText(file.raw, 'gbk');
    reader.onload = (e) => {
        editor.setValue(e.target.result)
        monaco.editor.setModelLanguage(editor.getModel(), getLanguageFromExtension(postfix))
        language.value = getLanguageFromExtension(postfix);
        showImport.value = false;
    }
}

const getFileExtension = (filename) => filename.split('.').pop().toLowerCase();
const getLanguageFromExtension = (extension) => {
    switch (extension) {
        case 'js':
            return 'javascript';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        default:
            return 'plaintext'; // 默认设置为纯文本
    }
}


</script>

<style scoped>
#codeEditBox {
    height: 100%;
}
</style>