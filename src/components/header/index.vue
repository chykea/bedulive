<template>
    <header class="header navbar-area">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <div class="nav-inner">
                        <nav class="navbar navbar-expand-lg">
                            <router-link class="navbar-brand" to="/">
                                <img src="../../assets/images/logo/logo.svg" alt="Logo">
                            </router-link>
                            <!-- 页面放大后出现的 -->
                            <button class="navbar-toggler mobile-menu-btn" type="button">
                                <span class="toggler-icon"></span>
                                <span class="toggler-icon"></span>
                                <span class="toggler-icon"></span>
                            </button>
                            <!-- 导航栏 -->
                            <div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                <ul id="nav" class="navbar-nav ms-auto">
                                    <li class="nav-item">
                                        <router-link to="/" active-class="active" class="dd-menu collapsed">首页</router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link active-class="active" class="dd-menu collapsed"
                                            to="/course">课程</router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link active-class="active" class="dd-menu collapsed"
                                            to="/notes">笔记</router-link>

                                    </li>
                                    <li class="nav-item">
                                        <router-link active-class="active" class="dd-menu collapsed"
                                            to="/liveList">直播</router-link>

                                    </li>
                                </ul>
                            </div>
                            <!-- 登录注册按钮 -->
                            <div class="user-button" v-if="!getToken()">
                                <ul>
                                    <li>
                                        <router-link to="/user/login"><i class="lni lni-enter"></i> 登录</router-link>
                                    </li>
                                    <li>
                                        <router-link to="/user/register"><i class="lni lni-user"></i> 注册</router-link>
                                    </li>
                                </ul>
                            </div>
                            <div class="user-button" v-else>
                                <ul>
                                    <router-link to="/user/info">
                                        <li><el-avatar> user </el-avatar></li>
                                        <li><a href="javascript:void(0)">{{ userInfo.nick_name }}</a></li>
                                    </router-link>
                                </ul>
                            </div>
                            <div class="button header-button" v-if="userInfo.identity == '0' || userInfo.identity == '2'">
                                <router-link to="/live" class="btn">开始上课</router-link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
import { ref } from 'vue';
import { getToken, getInfo } from '../../utils/util'
const userInfo = ref({})
try {

    const { user_name, nick_name, identity } = getInfo()
    userInfo.value = { user_name, nick_name, identity }
} catch (e) {

}

</script>
<style lang="scss" scoped></style>