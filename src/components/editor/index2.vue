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
    <div id="codeEditBox"></div>
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






</script>
  
<style scoped>
#codeEditBox {
    height: 100%;
}
</style>