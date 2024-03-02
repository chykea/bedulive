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
                                    <!-- 评论条数 -->
                                    <!-- <li>
                                        <a href="javascript:void(0)">
                                            <i class="lni lni-comments"></i>
                                            
                                        </a>
                                    </li> -->
                                    <!-- <li>
                                        <a href="javascript:void(0)">
                                            <i class="lni lni-eye"></i>
                                            55 View
                                        </a>
                                    </li> -->
                                </ul>
                                <!-- 文章内容 -->
                                <p>
                                    {{ article.content }}
                                </p>
                            </div>
                            <!-- 评论 -->
                            <!-- <div class="post-comments">
                                <h3 class="comment-title"><span>3 comments on this post</span></h3>
                                <ul class="comments-list">
                                    <li>
                                        <div class="comment-img">
                                            <img src="assets/images/blog/comment1.jpg" class="rounded-circle" alt="img">
                                        </div>
                                        <div class="comment-desc">
                                            <div class="desc-top">
                                                <h6>Arista Williamson</h6>
                                                <span class="date">19th May 2023</span>
                                                <a href="javascript:void(0)" class="reply-link"><i
                                                        class="lni lni-reply"></i>Reply</a>
                                            </div>
                                            <p>
                                                Donec aliquam ex ut odio dictum, ut consequat leo interdum. Aenean nunc
                                                ipsum, blandit eu enim sed, facilisis convallis orci. Etiam commodo
                                                lectus
                                                quis vulputate tincidunt. Mauris tristique velit eu magna maximus
                                                condimentum.
                                            </p>
                                        </div>
                                    </li>
                                    <li class="children">
                                        <div class="comment-img">
                                            <img src="assets/images/blog/comment2.jpg" class="rounded-circle" alt="img">
                                        </div>
                                        <div class="comment-desc">
                                            <div class="desc-top">
                                                <h6>Rosalina Kelian <span class="saved"><i
                                                            class="lni lni-bookmark"></i></span></h6>
                                                <span class="date">15th May 2023</span>
                                                <a href="javascript:void(0)" class="reply-link"><i
                                                        class="lni lni-reply"></i>Reply</a>
                                            </div>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim.
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="comment-img">
                                            <img src="assets/images/blog/comment3.jpg" class="rounded-circle" alt="img">
                                        </div>
                                        <div class="comment-desc">
                                            <div class="desc-top">
                                                <h6>Alex Jemmi</h6>
                                                <span class="date">12th May 2023</span>
                                                <a href="javascript:void(0)" class="reply-link"><i
                                                        class="lni lni-reply"></i>Reply</a>
                                            </div>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                veniam.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div> -->
                            <!-- 发布评论 -->
                            <div class="comment-form">
                                <h3 class="comment-reply-title"><span>留言</span></h3>
                                <form action="#" method="POST">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-box form-group">
                                                <textarea name="#" class="form-control form-control-custom"
                                                    placeholder="发？一条？友善的评论！"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="button">
                                                <button type="submit" class="btn">发表</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
                            <!-- <h5 class="widget-title"><span>Search This Site</span></h5> -->
                            <!-- <form action="#">
                                <input type="text" placeholder="Search Here...">
                                <button type="submit"><i class="lni lni-search-alt"></i></button>
                            </form> -->
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
import { getArticle } from '../../../request/index'
const route = useRoute()
const id = route.query.articleId;
const article = ref({})

const getArticleDetail = async () => {
    const { data } = await getArticle(id)
    article.value = data.res
}
getArticleDetail()
</script>

<style lang='scss' scoped>
.user {
    text-align: center;
}
</style>