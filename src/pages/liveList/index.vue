<template>
    <Header />
    <Breadcrumb />
    <section class="category-page section">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="category-grid-list">
                        <div class="row">
                            <div class="col-12">
                                <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="nav-grid" role="tabpanel"
                                        aria-labelledby="nav-grid-tab">
                                        <div class="row">
                                            <RoomCard v-for="t in liveList" :key="t.uid" :teacher="t" />
                                        </div>
                                        <div class="row">
                                            <div class="col-12">

                                                <!-- <div v-if="articleList.length" class="pagination left ">
                                                    <el-pagination :page-size="8" @current-change="handleCurrentChange"
                                                        :pager-count="5" background layout="prev, pager, next"
                                                        :total="total" />
                                                </div> -->

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<route>
{
    "name": "live-list",
    "meta": {
        "title": "直播列表"
    }
}
</route>
<script setup>
import { getLiveList } from '../../request/index'
import { onMounted, reactive } from 'vue';
import RoomCard from '../../components/roomcard/index.vue';
const liveList = reactive([])
onMounted(async () => {
    const { data } = await getLiveList()
    liveList.push(...data.res)
    console.log(liveList);
})

</script>
<style lang='scss' scoped></style>