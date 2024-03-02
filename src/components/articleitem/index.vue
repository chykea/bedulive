<template>
    <div class="main-content">
        <div class="dashboard-block mt-0">
            <h3 class="block-title">我的文章</h3>
            <div class="my-items">
                <div class="item-list-title">
                    <div class="row align-items-center">
                        <div class="col-lg-4 col-md-4 col-12">
                            <p>标题</p>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>发布时间</p>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>更新时间</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-right">
                            <p>操作</p>
                        </div>
                    </div>
                </div>
                <div class="single-item-list">
                    <div class="row align-items-center" v-for="a in articleList" :key="a.id">
                        <div class="col-lg-4 col-md-4 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ a.title }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>{{ a.createdAt }}</p>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12">
                            <p>{{ a.updatedAt }}</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-right">
                            <ul class="action-btn">
                                <li><a href="javascript:void(0)" title="编辑"><i class="lni lni-pencil"></i></a></li>
                                <li><a href="javascript:void(0)" title="查看" @click="checkDetail(a.id)"><i
                                            class="lni lni-eye"></i></a></li>
                                <li><a href="javascript:void(0)" title="删除" @click="deleteThis(a.id)"><i
                                            class="lni lni-trash"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <el-pagination :page-size="10" @current-change="handleCurrentChange" :pager-count="5" background
                    layout="prev, pager, next" :total="total" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserArticle, deleteArticle } from '../../request/index'
import { ElMessage } from 'element-plus';
const router = useRouter()
const articleList = ref([])
const total = ref(0)
const page = ref(1)
const getArticleList = async () => {
    const { data } = await getUserArticle(page.value)
    articleList.value = data.res.articles
    total.value = data.res.total
}
// 初始化数据
getArticleList()

const handleCurrentChange = async (val) => {
    page.value = val
    getArticleList()
}

const checkDetail = (id) => {
    router.push('/article/detail?articleId=' + id)
}

const deleteThis = async (id) => {
    const { data } = await deleteArticle(id)

    if (data.code === '0') {
        ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
                articleList.value = articleList.value.filter(item => item.id !== id)
            }
        })
    }
}


</script>

<style lang='scss' scoped>
::v-deep {
    .el-pagination.is-background .el-pager li.is-active {
        background-color: #5830E0 !important;
    }
}
</style>