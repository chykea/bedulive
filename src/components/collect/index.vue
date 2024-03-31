<template>
    <div class="main-content">
        <div class="dashboard-block mt-0">
            <h3 class="block-title">我的收藏</h3>

            <div class="my-items">
                <div class="item-list-title">
                    <div class="row align-items-center">
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>文章标题</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>作者</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <p>操作</p>
                        </div>
                    </div>
                </div>
                <div class="single-item-list">
                    <div class="row align-items-center" v-for="c in collectList" :key="c.id">
                        <div class="col-lg-3 col-md-3 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ c.article.title }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>{{ c.article.user.nick_name }}</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <ul class="action-btn">
                                <li><a href="javascript:void(0)" title="查看文章详细"
                                        @click="router.push('/article/detail?articleId=' + c.aid)">
                                        <i class="lni lni-eye"></i></a></li>
                                <li><a href="javascript:void(0)" title="取消收藏" @click="cancelCollect(c.aid)">
                                        <i class="lni lni-trash"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <el-pagination :page-size="10" v-if="total > 10" @current-change="handleCurrentChange" :pager-count="5"
                    background layout="prev, pager, next" :total="total" />
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { getAllCollect, removeCollectArticle } from '../../request/collect/index'
import { useRouter } from 'vue-router';
const router = useRouter()

const collectList = ref([])
const page = ref(1)
const total = ref(0)

const getCollectList = async (page) => {
    const { data } = await getAllCollect({ page })
    if (data.code == '0') {
        collectList.value = [...data.res]
        total.value = data.total
        console.log(collectList.value);
    }
}
getCollectList(page.value)
const handleCurrentChange = async (val) => {
    page.value = val
    await getCollectList(val)
}

const cancelCollect = async (aid) => {
    const { data } = await removeCollectArticle({ aid })
    if (data.code == '0') {
        await getCollectList(page.value)
        ElMessage({
            message: '取消收藏成功',
            type: 'success',
            duration: 1000
        })
    }
}
</script>
<style lang='scss' scoped>
.item-image {
    .content {
        display: flex;
        align-items: center;

        .title {
            text-align: center;
        }
    }
}
</style>