<template>
    <div class="main-content">
        <div class="dashboard-block mt-0">
            <h3 class="block-title">我的订阅</h3>

            <div class="my-items">
                <div class="item-list-title">
                    <div class="row align-items-center">
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>标题</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>教师</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <p>操作</p>
                        </div>
                    </div>
                </div>
                <div class="single-item-list">
                    <div class="row align-items-center" v-for="s in subscribeList" :key="s.id">
                        <div class="col-lg-3 col-md-3 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <h3 class="title"><a href="javascript:void(0)">{{ s.live.title }}</a></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <p>{{ s.live.user.nick_name }}</p>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <ul class="action-btn">
                                <li><a href="javascript:void(0)" title="进入直播间" @click="checkDetail(s.live.uid)">
                                        <i class="lni lni-eye"></i></a></li>
                                <li><a href="javascript:void(0)" title="取消订阅" @click="deleteThis(s.id)">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllSubscriptRoom, quitSubscribe, getLiveRoom } from '../../request/index'
import { ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter()
const subscribeList = ref([])
const total = ref(0)
const page = ref(1)
const getSubscribeList = async () => {
    const { data } = await getAllSubscriptRoom({ page: page.value })
    if (data.res) {
        subscribeList.value = [...data.res]
    }
    total.value = data.total
}
// 初始化数据
getSubscribeList()

const handleCurrentChange = async (val) => {
    page.value = val
    await getSubscribeList()
}

const checkDetail = (id) => {
    router.push('/live?roomId=' + id)
}

const deleteThis = (id) => {
    ElMessageBox.confirm(
        '真的要取消订阅吗？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const { data } = await quitSubscribe({ id })
            if (data.code === '0') {
                ElMessage({
                    message: '取消成功',
                    type: 'success',
                    duration: 1000,
                    onClose: async () => {
                        await getSubscribeList({ page: page.value })
                    }
                })
            }
        })
        .catch(() => {
        })
}
</script>
<style lang='scss' scoped></style>