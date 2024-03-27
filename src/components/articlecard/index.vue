<template>
    <div class="col-lg-6 col-12">
        <div class="single-news wow fadeInUp">
            <!-- 封面 -->
            <div class="image" v-if="article.cover_url">
                <router-link :to="'/article/detail?articleId=' + article.id">
                    <img class="thumb" :src="article.cover_url" alt="#">
                </router-link>
            </div>
            <div class="content-body">
                <h4 class="title">
                    <router-link :to="'/article/detail?articleId=' + article.id">
                        {{ article.title }}
                    </router-link>
                </h4>
                <!-- 摘要 -->
                <p>{{ article.digest }} </p>
                <div class="meta-details">
                    <ul>
                        <li><a href="javascript:void(0)">{{ article.createdAt }}</a></li>
                        <li><a href="javascript:void(0)">{{ article.user.nick_name }}</a></li>
                        <li><a href="javascript:void(0)">{{ article.commentCount }}条评论</a></li>
                        <!-- <li><a href="javascript:void(0)">Technology</a></li> -->
                    </ul>
                </div>
                <ul class="action">
                    <li v-if="store.userInfo.identity === '0'">
                        <a href="javascript:void(0)" @click="lockArticle(article.id, article.state)">{{ '锁定' }}</a>
                    </li>
                    <li v-if="store.userInfo.identity === '0'">
                        <a href="javascript:void(0)" @click="unlockArticle(article.id, article.state)">{{ '解除锁定' }}</a>
                    </li>
                    <li v-if="store.userInfo.uid === article.user.uid || store.userInfo.identity === '0'">
                        <a href="javascript:void(0)" @click="deleteBlog(article.id)">
                            {{ '删除' }}
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRootStore } from '../../store/index.js'
import { deleteArticle, lock, unlock } from '../../request/index.js'
import { debounce } from '../../utils/util'
const store = useRootStore()
const props = defineProps({
    article: Object
})
const emits = defineEmits(['reload'])
const lockArticle = debounce(async (id, state) => {
    if (state === 1) {
        ElMessage({
            message: '文章已锁定',
            type: 'success',
            duration: 1000
        })
        return
    }
    const { data } = await lock({ id })
    if (data.code === '0') {
        ElMessage.success(data.message)
        emits('reload')
    }
})
const unlockArticle = debounce(async (id, state) => {
    console.log(state);
    if (state === 0) {
        ElMessage({
            message: '文章已解锁',
            type: 'success',
            duration: 1000
        })
        return
    }
    const { data } = await unlock({ id })
    if (data.code === '0') {
        ElMessage.success(data.message)
        emits('reload')
    }
})
const deleteBlog = debounce(async (id) => {
    const { data } = await deleteArticle(id)
    if (data.code === '0') {
        ElMessage.success(data.message)
        emits('reload')
    }
})

</script>

<style lang='scss' scoped>
.title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

}

.image {
    text-align: center;

    a {
        .thumb {
            height: 240px;
            object-fit: contain;
        }
    }

}

.action li {
    display: inline-block;
    margin-right: 10px;
}
</style>