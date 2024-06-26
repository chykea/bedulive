<template>
    <section class="section blog-single">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-12 col-12">
                    <div class="single-inner">
                        <div class="post-thumbnils" v-if="article.cover_url">
                            <img :src="article.cover_url" alt="#">
                        </div>
                        <div class="post-details">
                            <div class="detail-inner">
                                <h2 class="post-title">
                                    {{ article.title }}
                                </h2>
                                <ul class="custom-flex post-meta">
                                    <!-- 发布时间 -->
                                    <li>
                                        <a href="javascript:void(0)">
                                            <i class="lni lni-calendar"></i>
                                            {{ article.createdAt }}
                                        </a>
                                    </li>
                                </ul>
                                <div v-if="article.file_url">
                                    <span class="des">文章附件：</span>&nbsp;
                                    <el-link>{{ article.file_name }}</el-link>&nbsp;
                                    <a class="el-link" @click="download(article.file_url, article.file_name)"
                                        target="_blank">下载</a>
                                </div>
                                <!-- 文章内容 -->
                                <div class="content-box" v-html="article.content">
                                </div>
                            </div>
                            <!-- 评论 -->
                            <div class="post-comments">
                                <h3 class="comment-title"><span>{{ commentsRef.length }}条评论</span></h3>
                                <ul class="comments-list">
                                    <Comment @reload="handleReload" :comments="commentsRef" />
                                </ul>
                            </div>
                            <!-- 发布评论 -->
                            <div class="comment-form">
                                <h3 class="comment-reply-title"><span>留言</span></h3>
                                <el-form>
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-box form-group">
                                                <textarea v-model="contentRef" class="form-control form-control-custom"
                                                    placeholder="发？一条？友善的评论！"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="button">
                                                <button type="button" class="btn" @click="publishComment">发表</button>
                                            </div>
                                        </div>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
                <aside class="col-lg-4 col-md-12 col-12">
                    <div class="sidebar blog-grid-page">
                        <div class="widget search-widget user">
                            <!-- 由于async/await影响，在数据没有加载完时控制台会报错 -->
                            <el-avatar :size="100" :src='article.user && article.user.avatar_url'></el-avatar>
                            <div style="margin-top: 20px;">
                                <span>{{ article.user && article.user.nick_name }}</span>
                            </div>
                            <div>
                                <a href="javascript:void(0)">@{{ article.user && article.user.user_name }}</a>
                            </div>
                            <div v-if="article.user && userInfo.uid != article.user.uid">
                                <a href="javascript:void(0)" class="btn btn-primary" v-if="!isSubscribe"
                                    @click="handleSubscribe(article.user.uid)">关注</a>
                                <a href="javascript:void(0)" class="btn btn-primary" v-else
                                    @click="handleCancelSubscribe(article.user.uid)">取消关注</a>
                            </div>
                            <div style="margin-top: 20px;">
                                <el-icon :size="50" style="cursor: pointer;"
                                    :style="[isCollectArticle ? 'color: #ff6700;' : '']"
                                    :title="isCollectArticle ? '取消收藏' : '收藏'"
                                    @click="isCollectArticle ? handleRemoveCollectArticle(article.id) : handleCollectArticle(article.id)">
                                    <Star />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</template>

<route>
    {
        name:'detail',
        meta:{
            title:'文章详细'
        }
    }
</route>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useRootStore } from '../../../store';
import { getArticle, addComment, getUserIsSubscribe, subscribeUser, cancelSubscribeUser } from '../../../request/index';
import { collectArticle, removeCollectArticle, isCollect } from '../../../request/collect/index'
import { ElMessage } from 'element-plus';
import { debounce } from '../../../utils/util';
import Comment from '../../../components/comments/index.vue'
const route = useRoute()
const store = useRootStore()
const userInfo = store.userInfo

const id = route.query.articleId;
const article = ref({})
const commentsRef = ref([])
const isSubscribe = ref(false)
const lock = ref(false)
const getIsSubscribe = async (uid) => {
    const { data } = await getUserIsSubscribe({ sub_uid: uid })
    isSubscribe.value = data.res
}

const getArticleDetail = async () => {
    const { data } = await getArticle(id)
    const { comments, ...res } = data.res
    article.value = res
    commentsRef.value = comments
    // 数据刷新后会导致回复列表关闭
    // 用于控制评论的展开与收起
    commentsRef.value.forEach(item => {
        item['expanded'] = false
    })
}

const isCollectArticle = ref(false)
const getIsCollect = async (aid) => {
    const { data } = await isCollect({ aid })
    if (data.code = '0') {
        isCollectArticle.value = data.res
    }
}

const handleReload = async () => {
    await getArticleDetail()
}
onMounted(async () => {
    await getArticleDetail()
    await getIsSubscribe(article.value.user.uid)
    await getIsCollect(id)
})



const contentRef = ref('')
const publishComment = async () => {
    if (lock.value) return
    lock.value = true
    if (!contentRef.value.trim()) return
    const parentId = null, content = contentRef.value, articleId = id;
    const { data } = await addComment({ parentId, content, articleId })
    if (data.code == '0') {
        contentRef.value = ''
        ElMessage({
            message: data.message,
            type: 'success',
            duration: 1500,
            onClose: () => {
                // 发布后重新获取评论
                getArticleDetail()
                lock.value = false
            }
        })
    }
}

const download = (url, fileName) => {//跨域文件路径、下载到本地的文件名
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a');
        a.href = url
        a.download = fileName;
        a.click()
    }
    x.send();
}
const handleSubscribe = async (uid) => {
    if (lock.value) return
    lock.value = true
    const { data } = await subscribeUser({ sub_uid: uid })
    if (data.code == '0') {
        ElMessage({
            message: '关注成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
                lock.value = false
            }
        })
        isSubscribe.value = true
    }
}
const handleCancelSubscribe = async (uid) => {
    if (lock.value) return
    lock.value = true
    const { data } = await cancelSubscribeUser({ sub_uid: uid })
    if (data.code == '0') {
        ElMessage({
            message: '取消关注成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
                lock.value = false
            }
        })
        isSubscribe.value = false
    }
}
const handleRemoveCollectArticle = async (aid) => {
    if (lock.value) return
    lock.value = true
    const { data } = await removeCollectArticle({ aid })
    if (data.code == '0') {
        ElMessage({
            message: '取消收藏成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
                lock.value = false
            }
        })
        isCollectArticle.value = false

    }

}

const handleCollectArticle = async (aid) => {
    if (lock.value) return
    lock.value = true
    const { data } = await collectArticle({ aid })
    if (data.code == '0') {
        ElMessage({
            message: '收藏成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
                lock.value = false
            }
        })
        isCollectArticle.value = true
    }
}
</script>

<style lang='scss' scoped>
.user {
    text-align: center;
}

.post-thumbnils {
    background-color: #fff;

    img {
        height: 450px;
        object-fit: contain;
    }
}

.des {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: 0;
    cursor: default;
    padding: 0;
    font-size: 14px;
    font-weight: 500;

}

.content-box {
    margin-top: 15px;

    :deep(ol) {
        list-style: decimal !important;
        list-style-position: inside !important;

        p {
            display: inline;
        }
    }
}
</style>