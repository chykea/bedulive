<template>
    <div class="blog-single section">
        <div class="container">
            <div class="row">
                <div class="blog-title">
                    <el-input class="title-input" v-model="title" size="large" placeholder="请输入标题"></el-input>
                    <el-input class="digest-input" v-model="digest" placeholder="请输入描述"></el-input>
                    <el-button style="margin-left: 10px;" @click="showCover = true">选择封面</el-button>
                    <el-button style="margin-left: 10px;" @click="showFile = true">添加附件</el-button>
                </div>
                <div class="blog-annex" v-show="file_name">
                    <el-link :href="file_url" target="_blank">{{ file_name }}</el-link>
                    &nbsp;
                    <span @click="deleteFile" class="el-link">删除</span>
                </div>
                <div class="blog-cover" v-show="cover_url">
                    <el-link :href="cover_url" target="_blank">{{ cover_name }}</el-link>
                    &nbsp;
                    <span @click="deleteCover" class="el-link">删除</span>
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
    <el-dialog v-model="showCover">
        <el-upload class="upload-demo" drag :before-upload="beforeCover" :http-request="uploadCover"
            :show-file-list="false" accept="image/jpeg,image/png">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖动图片到此处或<em> 点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    图片格式支持 jpg、png
                </div>
            </template>
        </el-upload>
    </el-dialog>
    <el-dialog v-model="showFile">
        <el-upload class="upload-demo" drag :http-request="uploadFile" :show-file-list="false"
            accept=".doc,.docx,.pdf,.txt,.xls,.xlsx">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖动文件到此处 或<em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    图片格式支持 jpg、png
                </div>
            </template>
        </el-upload>
    </el-dialog>

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
import { getArticle, updateArticle, publishArticle } from '../../../request/index'
import { handleUpload } from '../../../utils/uploadFIle';
import { ElMessage } from 'element-plus';

const TipTap = defineAsyncComponent({
    loader: () => import('../../../components/tiptap/index.vue'),
    loadingComponent: () => import('../../../components/loading/index.vue'),
    errorComponent: () => import('../../../components/error/index.vue'),
    delay: 2000,
    timeout: 10000
})
const router = useRouter()
const tid = history.state.tid || ''
const title = ref('')
const digest = ref('')
const html = ref('') // 文本内容
const cover_url = ref('')
const file_name = ref('')
const file_url = ref('')
const isEmpty = ref(true)

if (tid) {
    (async () => {
        const { data } = await getArticle(tid)
        title.value = data.res.title
        digest.value = data.res.digest
        html.value = data.res.content
        cover_url.value = data.res.cover_url
        cover_name.value = data.res.cover_url.replace(/^http(s|):\/\/\S*?\//, '')
        file_name.value = data.res.file_name
        file_url.value = data.res.file_url
        isEmpty.value = false
        // console.log(cover_name.value);
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
        const params = {
            id,
            title: title.value,
            content: html.value,
            digest: digest.value,
            cover_url: cover_url.value,
            file_name: file_name.value,
            file_url: file_url.value
        }
        const { data } = await updateArticle(params)
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
        const params =
        {
            title: title.value,
            content: html.value,
            digest: digest.value,
            cover_url: cover_url.value,
            file_name: file_name.value,
            file_url: file_url.value
        }
        const { data } = await publishArticle(params)
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

const showCover = ref(false)
const showFile = ref(false)
const cover_name = ref('')
const beforeCover = () => { }
const uploadCover = async (params) => {
    const { data } = await handleUpload(params.file, 'cover')
    if (data.result) {
        cover_url.value = data.result.url
        showCover.value = false
        ElMessage({
            message: "上传成功",
            type: "success",
            duration: 1000
        })
        cover_name.value = params.file.name
    }
}
const uploadFile = async (params) => {
    const { data } = await handleUpload(params.file, 'file')
    if (data.result) {
        file_url.value = data.result.url
        showFile.value = false
        ElMessage({
            message: "上传成功",
            type: "success",
            duration: 1000
        })
        file_name.value = params.file.name
    }
}
const deleteCover = () => {
    cover_url.value = ''
    cover_name.value = ''
}
const deleteFile = () => {
    // 删除文件,这里只是把这个文件名置空,并没有删除服务器上的文件
    file_url.value = ''
    file_name.value = ''
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

.blog-cover {
    img {
        display: inline-block;
        width: 450px;
        height: 450px;
        object-fit: contain;
    }

    margin-bottom: 20px;
}

.deleteFile {
    font-size: var(--el-link-font-size);
}
</style>