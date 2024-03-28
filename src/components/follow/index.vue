<template>
    <div class="main-content">
        <div class="dashboard-block mt-0">
            <h3 class="block-title">我的关注</h3>

            <div class="my-items">
                <div class="item-list-title">
                    <div class="row align-items-center">
                        <div class="col-lg-9 col-md-9 col-12">
                            <p>用户</p>
                        </div>

                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <p>操作</p>
                        </div>
                    </div>
                </div>
                <div class="single-item-list">
                    <div class="row align-items-center" v-for="f in followList" :key="f.id">
                        <div class="col-lg-9 col-md-9 col-12">
                            <div class="item-image">
                                <div class="content">
                                    <div class="d-flex align-items-center">
                                        <el-avatar :src="f.user.avatar_url" :size="60"></el-avatar>
                                    </div>
                                    <div style="margin-left: 15px;">
                                        <p class="title"><span>{{ f.user.nick_name }}</span></p>
                                        <p class="title"><a href="javascript:void(0)">@{{ f.user.nick_name }}</a></p>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div class="col-lg-3 col-md-3 col-12 align-center">
                            <ul class="action-btn">
                                <li><a href="javascript:void(0)" title="个人主页">
                                        <i class="lni lni-eye"></i></a></li>
                                <li><a href="javascript:void(0)" title="取消关注" @click="cancelFollow(f.sub_uid)">
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
import { getUserSubscribeList, cancelSubscribeUser } from '../../request/index'
const followList = ref([])
const page = ref(1)
const total = ref(0)

const getFollowList = async (page) => {
    const { data } = await getUserSubscribeList({ page })
    if (data.code == '0') {
        followList.value = [...data.res]
        total.value = data.total
    }
}
getFollowList(page.value)
const handleCurrentChange = async (val) => {
    page.value = val
    await getFollowList(val)
}

const cancelFollow = async (uid) => {
    const { data } = await cancelSubscribeUser({ sub_uid: uid })
    console.log(data);
    if (data.code == '0') {
        await getFollowList(page.value)
        ElMessage({
            message: '取消关注成功',
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