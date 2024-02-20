<template>
    <!-- <div>个人中心</div> -->
    <Breadcrumb />
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
import { onMounted } from 'vue'
import { getUserInfo } from '../../../request/index'
import { useRouter } from 'vue-router';
const router = useRouter()
onMounted(async () => {
    try {
        const { data } = await getUserInfo() // 请求自带了token,后端通过token进行解析查询
        console.log(data);
    } catch (e) {
    }

})
</script>
<style lang='scss' scoped></style>