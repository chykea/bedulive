<template>
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
import { nextTick, ref, onBeforeUnmount, onMounted, watch } from 'vue'


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

defineExpose({ changeLanguage })



</script>
  
<style scoped>
#codeEditBox {
    height: 100%;
}
</style>