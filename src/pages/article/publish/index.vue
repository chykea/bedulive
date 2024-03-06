<template>
    <div class="blog-single section">
        <div class="container">
            <div class="row">
                <div class="blog-title">
                    <el-input class="title-input" v-model="title" size="large" placeholder="请输入标题"></el-input>
                    <el-input class="digest-input" v-model="digest" placeholder="请输入描述"></el-input>
                </div>
                <div class="blog-editor">
                    <TipTap v-model:html="html" @isEmpty="handleEmpty"></TipTap>
                </div>
                <div class="blog-sumbit">
                    <el-button class="custom-el-btn-color" plain size="large" @click="handleSubmit(tid)">{{ tid != '' ?
                        '更新文章'
                        : '发布文章' }}</el-button>
                </div>
            </div>
        </div>
    </div>


</template>

<route>
    {
        name:"publish",
        meta:{title:"发布文章"}
    }

</route>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
// import TipTap from '../../../components/tiptap/index.vue'
import { getArticle, updateArticle, publishArticle } from '../../../request/index'
import { ElMessage } from 'element-plus';

const TipTap = defineAsyncComponent({
    loader: () => import('../../../components/tiptap/index.vue'),
    loadingComponent: () => import('../../../components/loading/index.vue'),
    errorComponent: () => import('../../../components/error/index.vue'),
    delay: 200,
    timeout: 10000
})
const router = useRouter()
const tid = history.state.tid || ''
const title = ref('')
const digest = ref('')
const html = ref('') // 文本内容
const isEmpty = ref(true)

if (tid) {
    (async () => {
        const { data } = await getArticle(tid)
        title.value = data.res.title
        digest.value = data.res.digest
        html.value = data.res.content
    })()
}

const handleSubmit = async (id) => {
    if (title.value === '') {
        ElMessage({ message: '标题不能为空', type: 'warning', duration: 1000 })
        return
    }
    if (digest.value === '') {
        ElMessage({ message: '摘要不能为空', type: 'warning', duration: 1000 })
        return
    }
    if (isEmpty.value) {
        ElMessage({ message: '内容不能为空', type: 'warning', duration: 1000 })
        return
    }
    if (title.value.length > 20) {
        ElMessage({ message: '标题长度只能在20字左右', type: 'warning', duration: 1000 })
        return
    }
    if (digest.value.length > 50) {
        ElMessage({ message: '摘要长度只能在50字左右', type: 'warning', duration: 1000 })
        return
    }
    if (id !== '') {
        // 更新文章
        const { data } = await updateArticle({ id, title: title.value, content: html.value, digest: digest.value })
        if (data.code == '0') {
            ElMessage({
                message: data.message,
                type: 'success',
                duration: 1000,
                onClose: () => {
                    router.push({ path: '/article/list' })
                }
            })
        }

    } else {
        // 发布文章
        const { data } = await publishArticle({ title: title.value, content: html.value, digest: digest.value })
        if (data.code == '0') {
            ElMessage({
                message: data.message,
                type: 'success',
                duration: 1000,
                onClose: () => {
                    router.push({ path: '/article/list' })
                }
            })

        }
    }
}

const handleEmpty = (val) => {
    isEmpty.value = val
}
</script>

<style lang='scss' scoped>
.blog-title {
    margin-bottom: 20px;

    .title-input {
        border: none;
        background: #fff;
        font-size: 14px;
        color: #081828;
        // padding: 0 25px;
        font-weight: 500;
        height: 55px;
        border: 1px solid #eee;
        margin-bottom: 25px;
        border-radius: 0;
        font-size: 15px;
        font-weight: 400;
        border-radius: 5px;
    }

    .digest-input {
        width: 250px;
    }
}

.blog-editor {
    margin-bottom: 20px;
}
</style>