<template>
    <div class="editor" v-if="editor" :style="{ width, height }">
        <MenuBar class="editor-header" :editor="editor" />
        <editor-content class="editor-content" :editor="editor" />
    </div>
</template>

<script setup>
import { watch } from 'vue'
import { debounce } from '../../utils/util'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './components/MenuBar.vue'

const props = defineProps({
    // 内容
    html: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '500px'
    }
})

const emits = defineEmits(['update:html', 'isEmpty'])
const editor = useEditor({
    content: props.html,
    extensions: [
        StarterKit
    ],
    onUpdate: debounce((() => {
        emits('update:html', editor.value.getHTML())
        emits('isEmpty', editor.value.isEmpty)
    }))
})
// 初始化文章内容
const unwatch = watch(() => props.html, (val) => {
    editor.value && editor.value.commands.setContent(props.html, false) // 设置内容,并且不触发onUpdate事件  
    editor.value && emits('isEmpty', editor.value.isEmpty)
    unwatch()
})



</script>

<style lang='scss' scoped>
.editor {
    display: flex;
    flex-direction: column;
    max-height: 26rem;
    color: #0d0d0d;
    background-color: #fff;
    border: 3px solid #0d0d0d;
    border-radius: .50rem;

    &-header {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: wrap;
        padding: .25rem;
        border-bottom: 2px solid #0d0d0d;
    }

    &-content {
        padding: .7rem .5rem;
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
}
</style>

<style lang='scss'>
/* 基本编辑器样式 */
/* 编辑器样式，需要去掉*/
.ProseMirror {
    height: 100%;

    &:focus {
        outline: none;
    }

    ul,
    ol {
        list-style: initial;
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, .1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: .75rem 1rem;
        border-radius: .5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: .8rem;
        }
    }

    mark {
        background-color: #faf594;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    hr {
        margin: 1rem 0;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, .1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, .1);
        margin: 2rem 0;
    }

    ul[data-type="taskList"] {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;

            >label {
                flex: 0 0 auto;
                margin-right: .5rem;
                user-select: none;
            }

            >div {
                flex: 1 1 auto;
            }
        }
    }
}
</style>