<template>
    <li v-for="comment in comments" :key="comment.id">
        <div class="comment-img">
            <el-avatar :size="100">{{ comment.user.nick_name }}</el-avatar>
        </div>
        <div class="comment-desc">
            <div class="desc-top">
                <h6>{{ comment.user.nick_name }}</h6>
            </div>
            <p style="margin-bottom: 15px;">
                {{ comment.content }}
            </p>
            <span class="date">{{ comment.createdAt }}</span>&nbsp;
            <a href="javascript:void(0)" class="reply-link" @click="showReply(comment.id)">回复</a>
            &nbsp;
            <a href="javascript:void(0)" class="reply-link" @click="deleteReply(comment.id)">删除</a>
        </div>
        <div v-if="comment.replies.length" style="margin-top: 15px;">
            <span>共有{{ comment.replies.length }}条回复</span>&nbsp;
            <a href="javascript:void(0)" class="reply-link" @click="comment.expanded = true">查看回复</a>
        </div>
        <div :id="prefix + comment.id"></div>
        <template v-if="comment.replies.length">
            <el-dialog v-model="comment.expanded" draggable title="回复列表" width="800">
                <Reply v-for="reply in comment.replies" :reply="reply" :articleId="articleId" />
            </el-dialog>
        </template>

    </li>
    <Teleport v-if="locationID !== 'body'" :to="locationID">
        <div>
            <el-input v-model="replyContent" style="height:50px" placeholder="请输入内容哟"></el-input>
            <div style="margin-top: 10px; text-align: right;">
                <el-button class="btn" @click="handleReply">回复</el-button>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Reply from './components/reply.vue'
import { addComment, deleteComment } from '../../request/index'
const route = useRoute()
const props = defineProps({
    comments: {
        type: Array,
        default: () => []
    }
})
const { articleId } = route.query
const locationID = ref('body')
const prefix = 'reply-'
const replyContent = ref('')
let id = null
// 评论的回复组件
const showReply = async (parentId) => {
    if (locationID.value.length > prefix.length + 1) {
        const tmp = locationID.value.substring(prefix.length + 1, locationID.value.length)
        if (tmp == parentId) {
            locationID.value = 'body'
            id = null
            return
        }
    }
    locationID.value = '#' + prefix + parentId
    id = parentId
}
// 回复
const handleReply = async () => {
    const parentId = id;
    if (!replyContent.value) {
        ElMessage({
            message: '请输入回复内容',
            type: 'warning',
            duration: 1000
        })
        return
    }
    const { data } = await addComment({
        parentId, content: replyContent.value, articleId
    })
    if (data.code == '0') {
        ElMessage({
            message: '回复成功',
            type: 'success',
            duration: 1000
        })
        locationID.value = 'body'
        id = null
        replyContent.value = ''
        location.reload()
        return
    }
    ElMessage({
        message: '回复失败',
        type: 'error',
        duration: 1000
    })

}
// 删除
const deleteReply = async (commentId) => {
    try {
        const res = await ElMessageBox.confirm(
            '删除评论操作不可逆！是否继续',
            'Warning',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        if (res === 'confirm') {
            const { data } = await deleteComment(commentId)
            if (data.code == '0') {
                ElMessage({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000
                })
                location.reload()
                return
            }
            ElMessage({
                message: '删除失败',
                type: 'error',
                duration: 1000
            })
        }
    } catch (e) {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    }
}

</script>

<style lang='scss' scoped>
.reply-link {
    color: #aaa;
    cursor: pointer;

    &:hover {
        color: #0d6efd;
    }
}

.date {
    font-size: 12px;
    color: #999;
}
</style>