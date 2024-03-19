<template>
    <div class="col-lg-6 col-12">
        <div class="single-news wow fadeInUp" data-wow-delay=".2s">
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
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    article: Object
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
</style>