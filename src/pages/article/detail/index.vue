<template>
    <section class="section blog-single">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-12 col-12">
                    <div class="single-inner">
                        <!-- 封面 -->
                        <!-- <div class="post-thumbnils">
                            <img src="assets/images/blog/blog-single.jpg" alt="#">
                        </div> -->
                        <div class="post-details">
                            <div class="detail-inner">
                                <!-- 标题 -->
                                <h2 class="post-title">
                                    {{ article.title }}
                                </h2>
                                <!-- post meta -->
                                <ul class="custom-flex post-meta">
                                    <!-- 发布时间 -->
                                    <li>
                                        <a href="javascript:void(0)">
                                            <i class="lni lni-calendar"></i>
                                            {{ article.createdAt }}
                                        </a>
                                    </li>

                                </ul>
                                <!-- 文章内容 -->
                                <div v-html="article.content" style="margin-top: 15px;">
                                </div>
                            </div>
                            <!-- 评论 -->
                            <div class="post-comments">
                                <h3 class="comment-title"><span>{{ commentsRef.length }}条评论</span></h3>
                                <ul class="comments-list">
                                    <Comment :comments="commentsRef" />
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
                            <el-avatar :size="100">{{ article.author }}</el-avatar>
                            <div style="margin-top: 20px;">
                                <span>{{ article.author }}</span>
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
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { getArticle, addComment } from '../../../request/index'
import { ElMessage } from 'element-plus';
import Comment from '../../../components/comments/index.vue'
const route = useRoute()
const id = route.query.articleId;
const article = ref({})
const commentsRef = ref([])

const getArticleDetail = async () => {
    const { data } = await getArticle(id)
    const { comments, ...res } = data.res

    article.value = res
    commentsRef.value = comments
    // 用于控制评论的展开与收起
    commentsRef.value.forEach(item => {
        item['expanded'] = false
    })

}
getArticleDetail()
const contentRef = ref('')
const publishComment = async () => {
    const parentId = null, content = contentRef.value, articleId = id;
    const { data } = await addComment({ parentId, content, articleId })
    if (data.code == '0') {
        ElMessage({
            message: data.message,
            type: 'success',
            duration: 1000,
            onClose: () => {
                // 发布后刷新页面
                location.reload()
            }
        })
        contentRef.value = ''
    }
}
</script>

<style lang='scss' scoped>
.user {
    text-align: center;
}
</style>