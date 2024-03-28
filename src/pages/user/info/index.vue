<template>
    <!-- <div>个人中心</div> -->
    <Breadcrumb />
    <section class="dashboard section">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-4 col-12">

                    <div class="dashboard-sidebar">
                        <div class="user-image">
                            <el-avatar :size="100" :src="user.avatar_url" />
                            <h3 style="display:inline-block;">{{ user.nick_name }}
                                <span><a href="javascript:void(0)">@{{ user.user_name }}</a></span>
                            </h3>
                        </div>
                        <div class="dashboard-menu">
                            <ul>
                                <template v-for="i in key" :key="i.value">
                                    <li v-if="i.value == 'user' && user.identity == '0'">
                                        <a :class="{ active: current == i.value }" href="javascript:void(0)"
                                            @click="current = i.value">
                                            <i class="lni lni-pencil-alt">
                                            </i>{{ i.label }}
                                        </a>
                                    </li>
                                    <li v-else-if="i.value !== 'user'">
                                        <a :class="{ active: current == i.value }" href="javascript:void(0)"
                                            @click="current = i.value">
                                            <i class="lni lni-pencil-alt">
                                            </i>{{ i.label }}
                                        </a>
                                    </li>
                                </template>
                            </ul>
                            <div class="button">
                                <a class="btn" href="javascript:void(0)" @click="logout">退出登录</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 col-md-8 col-12">
                    <keep-alive>
                        <component :is="map.get(current)"></component>
                    </keep-alive>
                </div>
            </div>
        </div>
    </section>
</template>

<route>
    {
        name:'info',
        meta: {
            title: '个人中心'
        }
    }
</route>

<script setup>
import UserEdit from '../../../components/useredit/index.vue'
import EditInfo from '../../../components/editinfo/index.vue'
import Article from '../../../components/articleitem/index.vue'
import Subscribe from '../../../components/subscribeitem/index.vue'
import Follow from '../../../components/follow/index.vue'

import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useRootStore } from '../../../store/index'
const router = useRouter()
const store = useRootStore()
const user = ref(store.userInfo)
const current = ref('editinfo')
const key = ref([
    { label: '用户管理', value: 'user' },
    { label: '编辑个人资料', value: 'editinfo' },
    { label: '文章管理', value: 'article' },
    { label: '订阅管理', value: 'subscribe' },
    { label: '我的关注', value: 'follow' }
])
const map = new Map([
    ['editinfo', EditInfo],
    ['article', Article],
    ['subscribe', Subscribe],
    ['user', UserEdit],
    ['follow', Follow]
])

watchEffect(() => {
    user.value = store.userInfo
})


// 退出登录
const logout = () => {
    store.token = ''
    store.userInfo = {}
    ElMessage({
        message: '退出成功',
        duration: 1500,
        type: 'success',
        onClose: () => {
            router.push('/user/login')
        }
    })
}
</script>

<style lang='scss' scoped></style>