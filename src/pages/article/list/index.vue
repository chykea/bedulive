<template>
    <section class="section latest-news-area blog-list">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-7 col-12">
                    <div class="row">
                        <template v-if="articleList.length">
                            <Articlecard v-for="a in articleList" :key="a.id" :article="a" />
                        </template>

                        <template v-else>
                            <div class="col-12">
                                <div class="alert " role="alert">
                                    <h4 class="alert-heading">暂时没有查到文章哟~</h4>
                                </div>
                            </div>
                        </template>

                        <div v-if="articleList.length" class="pagination left ">
                            <el-pagination :page-size="8" @current-change="handleCurrentChange" :pager-count="5"
                                background layout="prev, pager, next" :total="total" />
                        </div>
                    </div>
                </div>

                <aside class="col-lg-4 col-md-5 col-12">
                    <div class="sidebar blog-grid-page">
                        <div class="widget publish-widget">
                            <router-link to="/article/publish">
                                <button class="btn publish">发布文章</button>
                            </router-link>
                        </div>
                        <div class="widget search-widget">
                            <h5 class="widget-title"><span>搜索文章</span></h5>
                            <el-form>
                                <input v-model="keyword" type="text" placeholder="输入关键字">
                                <button type="button" @click="search"><i class="lni lni-search-alt"></i></button>
                            </el-form>
                        </div>


                        <!-- Start Single Widget -->
                        <!-- <div class="widget popular-tag-widget">
                            <h5 class="widget-title"><span>分类</span></h5>
                            <div class="tags">
                                <a href="javascript:void(0)">Jobpress</a>
                                <a href="javascript:void(0)">Design</a>
                                <a href="javascript:void(0)">HR</a>
                                <a href="javascript:void(0)">Recruiter</a>
                                <a href="javascript:void(0)">Interview</a>
                                <a href="javascript:void(0)">Employee</a>
                                <a href="javascript:void(0)">Labor</a>
                                <a href="javascript:void(0)">Salary</a>
                                <a href="javascript:void(0)">Consult</a>
                                <a href="javascript:void(0)">Business</a>
                                <a href="javascript:void(0)">Candidates</a>
                            </div>
                        </div> -->
                        <!-- End Single Widget -->
                    </div>
                </aside>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import Articlecard from '../../../components/articlecard/index.vue'
import { getAllArticle, searchArticle } from '../../../request/index'
import { ref } from 'vue'
const articleList = ref([])
const page = ref(1)
const total = ref(0)

const getArticleList = async () => {
    const { data } = await getAllArticle(page.value)
    articleList.value = data.res.articles
    total.value = data.res.total
}
// 获取文章列表
getArticleList()

const handleCurrentChange = async (val) => {
    page.value = val
    const { data } = await getAllArticle(val)
    if (data.code === '1') {
        ElMessage({
            message: '加载文章失败',
            type: 'error',
            duration: 1000
        })
        return
    }
    articleList.value = data.res.articles
    total.value = data.res.total
}

const keyword = ref('')
const search = async () => {
    // if (keyword.value === '') return
    page.value = 1
    const params = {
        page: page.value,
        keyword: keyword.value
    }
    const { data } = await searchArticle(params)
    if (data.code === '1') {
        ElMessage({
            message: '搜索文章失败',
            type: 'error',
            duration: 1000
        })
        return
    }
    articleList.value = data.res.articles
    total.value = data.res.total
}

</script>

<style lang='scss' scoped>
.publish {
    display: inline-block;
    text-transform: capitalize;
    font-size: 15px;
    font-weight: 500;
    padding: 15px 30px;
    background-color: #5830E0;
    color: #fff;
    border: none;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    border-radius: 4px;
}

// .pagination {
//     height: 32px;
// }

::v-deep(.el-pagination.is-background .el-pager li.is-active) {
    background-color: #5830E0 !important;
}
</style>