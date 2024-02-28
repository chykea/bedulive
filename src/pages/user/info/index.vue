<template>
    <!-- <div>个人中心</div> -->
    <Breadcrumb />
    <section class="dashboard section">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-4 col-12">
                    <!-- Start Dashboard Sidebar -->
                    <div class="dashboard-sidebar">
                        <div class="user-image">
                            <img src="src/assets/images/dashboard/user-image.jpg" alt="#">
                            <h3>Steve Aldridge
                                <span><a href="javascript:void(0)">@username</a></span>
                            </h3>
                        </div>
                        <div class="dashboard-menu">
                            <ul>

                                <li><a class="active" href="javascript:void(0)"><i class="lni lni-pencil-alt"></i>Edit
                                        Profile</a></li>
                            </ul>
                            <div class="button">
                                <a class="btn" href="javascript:void(0)">Logout</a>
                            </div>
                        </div>
                    </div>
                    <!-- Start Dashboard Sidebar -->
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