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
    <el-button @click="runCode" class="custom-el-btn-color" plain>运行</el-button>

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
import { nextTick, ref, onBeforeUnmount, h, onMounted } from 'vue'
import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { debounce } from '../../utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSocket } from '../../utils/socket'
import { useToolStore, useCodeStore, useRootStore } from '../../store'
// const userStore = useRootStore()
const roomStore = useToolStore()
const codeStore = useCodeStore()
const emits = defineEmits(['update:modelValue'])
const client = getSocket()
const language = ref('javascript')
const theme = ref('vs')
const fontSize = ref(16)
const code = ref('')
const editorLock = ref(false)

// const ydoc = new Doc()
// const ytext = ydoc.getText('monaco')

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
// 编辑器初始化
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

        /* ydoc.on('update', (update) => {
            if (roomStore.connect) {
                client.socket.emit('update:yjs', { roomId: roomStore.roomId, update })
            }
        })
        client.socket.on('update', (update) => {
            let yjsupdate = new Uint8Array(update)
            applyUpdate(ydoc, yjsupdate)
            yjsupdate = null
        })
        new MonacoBinding(ytext, editor.getModel(), new Set()) */

        // 监听编辑器内容变化
        editor.onDidChangeModelContent(debounce((val) => {
            if (!(editorLock.value)) { // 没有锁就执行
                // code.value 用于导入导出代码
                codeStore.code = code.value = editor.getValue()
                if (roomStore.connect) { // 当加入房间时再进行发送
                    client.socket.emit('sendCode', { roomId: roomStore.roomId, code: code.value, })
                }
            }
            editorLock.value = false
            /* codeStore.code = code.value = editor.getValue()
            if (roomStore.roomId === userStore.userInfo.uid && roomStore.connect) {
                client.socket.emit('init:yjs', { roomId: roomStore.roomId, code: code.value })
            } */
        }))
    })
}

onMounted(() => {
    editorInit()
})



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
const runCode = () => {
    if (language.value !== 'javascript') {
        ElMessage({
            message: '只支持运行js代码',
            type: 'error',
            duration: 1000
        })
        return
    }
    client.socket.emit('runCode', { code: code.value });
}

client.socket.on('runRes', (result) => {
    if (!result.length) {
        ElMessage({
            message: '没有运行结果,需要打印结果时使用console.log进行输出',
            type: 'success',
            duration: 1000
        })
        return
    }
    const vnode = h('div', generateResult(result))
    ElMessageBox.alert(vnode, '运行结果')
});

client.socket.on('runErr', (error) => {
    console.error('执行错误:', error);
});

// 加入房间获取代码,获取代码需要锁住编辑器,防止设置代码之后编辑器触发监听事件
client.socket.on('receiveCode', (data) => {
    editorLock.value = true;
    codeStore.code = code.value = data.code;
    editor.setValue(data.code);
})
// 生成代码运行结果
const generateResult = (result) => result.map((item, index) => h('div', (index + 1) + '.' + item));


</script>

<style scoped>
#codeEditBox {
    height: 100%;
}
</style>