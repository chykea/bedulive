<template>
    <div class="col-lg-6 col-12">
        <div class="single-news wow fadeInUp" data-wow-delay=".2s">
            <!-- 封面 -->
            <!-- <div class="image">
                <a href="blog-single-sidebar.html"><img class="thumb" src="assets/images/blog/blog1.jpg" alt="#"></a>
            </div> -->
            <div class="content-body">
                <h4 class="title"><router-link :to="'/article/detail?articleId=' + article.id">{{ article.title
                        }}</router-link></h4>
                <!-- 摘要 -->
                <p>{{ article.content }} </p>
                <div class="meta-details">
                    <ul>
                        <li><a href="javascript:void(0)">{{ article.createdAt }}</a></li>
                        <li><a href="javascript:void(0)">{{ article.author }}</a></li>
                        <!-- <li><a href="javascript:void(0)">Technology</a></li> -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    article: Object
})
</script>

<style lang='scss' scoped></style>