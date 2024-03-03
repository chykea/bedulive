<template>
    <div>
        <template v-for="(item, index) in items">
            <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
            <menu-item v-else :key="index" v-bind="item" />
        </template>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import MenuItem from './MenuItem.vue'


const props = defineProps({
    editor: {
        type: Object,
        required: true
    }
})

const items = reactive([
    {
        icon: 'bold',
        title: '粗体',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => props.editor.isActive('bold')
    },
    {
        icon: 'italic',
        title: '斜体',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic')
    },
    {
        icon: 'strikethrough',
        title: '划线',
        action: () => props.editor.chain().focus().toggleStrike().run(),
        isActive: () => props.editor.isActive('strike')
    },
    {
        icon: 'code-view',
        title: '代码',
        action: () => props.editor.chain().focus().toggleCode().run(),
        isActive: () => props.editor.isActive('code')
    },
    // {
    //     icon: 'mark-pen-line',
    //     title: '高亮',
    //     action: () => props.editor.chain().focus().toggleHighlight().run(),
    //     isActive: () => props.editor.isActive('highlight')
    // },
    {
        type: 'divider'
    },
    {
        icon: 'h-1',
        title: 'Heading 1',
        action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 1 })
    },
    {
        icon: 'h-2',
        title: 'Heading 2',
        action: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 2 })
    },
    {
        icon: 'h-3',
        title: 'Heading 3',
        action: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 3 })
    },
    {
        icon: 'h-4',
        title: 'Heading 4',
        action: () => props.editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 4 })
    },
    {
        icon: 'h-5',
        title: 'Heading 5',
        action: () => props.editor.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 5 })
    },
    {
        icon: 'h-6',
        title: 'Heading 6',
        action: () => props.editor.chain().focus().toggleHeading({ level: 6 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 6 })
    },
    {
        icon: 'paragraph',
        title: '段落',
        action: () => props.editor.chain().focus().setParagraph().run(),
        isActive: () => props.editor.isActive('paragraph')
    },
    {
        icon: 'list-unordered',
        title: '无序列表',
        action: () => props.editor.chain().focus().toggleBulletList().run(),
        isActive: () => props.editor.isActive('bulletList')
    },
    {
        icon: 'list-ordered',
        title: '有序列表',
        action: () => props.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => props.editor.isActive('orderedList')
    },
    {
        icon: 'list-check-2',
        title: '任务列表',
        action: () => props.editor.chain().focus().toggleTaskList().run(),
        isActive: () => props.editor.isActive('taskList')
    },
    {
        icon: 'code-box-line',
        title: '代码块',
        action: () => props.editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => props.editor.isActive('codeBlock')
    },
    {
        type: 'divider'
    },
    {
        icon: 'double-quotes-l',
        title: '双引号',
        action: () => props.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => props.editor.isActive('blockquote')
    },
    {
        icon: 'separator',
        title: 'Horizontal Rule',
        action: () => props.editor.chain().focus().setHorizontalRule().run()
    },
    {
        type: 'divider'
    },
    {
        icon: 'text-wrap',
        title: '硬回车',
        action: () => props.editor.chain().focus().setHardBreak().run()
    },
    {
        icon: 'format-clear',
        title: '格式刷',
        action: () => props.editor.chain()
            .focus()
            .clearNodes()
            .unsetAllMarks()
            .run()
    },
    {
        type: 'divider'
    },
    {
        icon: 'arrow-go-back-line',
        title: 'Undo',
        action: () => props.editor.chain().focus().undo().run()
    },
    {
        icon: 'arrow-go-forward-line',
        title: 'Redo',
        action: () => props.editor.chain().focus().redo().run()
    }
])

</script>

<style lang="scss">
.divider {
    width: 2px;
    height: 1.25rem;
    background-color: rgba(#000, .1);
    margin-left: .5rem;
    margin-right: .75rem;
}
</style>