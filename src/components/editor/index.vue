<template>
    <div id="codeEditBox"></div>
</template>
  

<script setup>
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor';
import { nextTick, ref, onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps({
    code: { type: String, default: '' },
    isReadOnly: { Boolean, default: false }
})


const text = ref('')
const isReadOnly = ref(false)



const emits = defineEmits(['mounted', 'unmounted'])
onMounted(() => {
    emits('mounted')
    // 学生端打开代码编辑器,进行初始化
    const unwatch = watch(() => props.code, (newValue) => {

        text.value = newValue
        nextTick(() => {
            editor.setValue(newValue)
            // 不然就会导致值监听两次
            unwatch()
        })
    }, { immediate: true })
    const unwatch2 = watch(() => props.isReadOnly, (newValue) => {
        isReadOnly.value = newValue
        nextTick(() => {
            editor.updateOptions({ readOnly: newValue })
            // 不然就会导致值监听两次
            unwatch2()
        })
    }, { immediate: true })
})

onBeforeUnmount(() => {
    editor.dispose()
    // 卸载监听函数
    emits('unmounted')
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
            value: text.value, // 编辑器初始显示文字
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
        // 监听值的变化
        // 编辑的代码发生变化时
        editor.onDidChangeModelContent((val) => {
            text.value = editor.getValue();
        })
    })
}
editorInit()

const historyMap = new Map()
const changeLanguage = (language) => {
    // 存储当前语言编辑的代码
    historyMap.set(editor.getModel().getLanguageIdAtPosition(), text.value)
    monaco.editor.setModelLanguage(editor.getModel(), language)
    // 清除当前代码
    // text.value = ''
    editor.setValue('')
    // 把之前存储的代码回显
    if (historyMap.get(language)) {

        text.value = historyMap.get(language)
        editor.setValue(historyMap.get(language))
    }
}
const setReadOnly = (val) => {
    nextTick(() => {
        editor.updateOptions({ readOnly: val })
    })
}
const setEditorValue = (value) => {
    nextTick(() => {
        editor.setValue(value)
    })
}
const getIsReadOnly = () => {
    return editor.getOption(monaco.editor.EditorOption.readOnly)
}


// 暴露属性/方法给父组件
defineExpose({ text, changeLanguage, setReadOnly, setEditorValue, getIsReadOnly })

</script>
  
<style scoped>
#codeEditBox {
    height: 100%;
}
</style>