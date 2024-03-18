<template>
    <Header />
    <section class="hero-area style2 overlay">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-7 col-md-12 col-12">
                    <div class="hero-text wow fadeInLeft">
                        <div class="section-heading">
                            <h2>欢迎来到bedulive</h2>
                            <p>一个多人协同的编程教育平台</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-md-12 col-12">

                    <div class="search-form style2 wow fadeInRight">
                        <h3 class="heading-title">引导</h3>
                        <p class="sub-heding-text">虽然一下子就能看出来是哪个模块对应的功能是干啥的，但是我还是要提醒你！</p>
                        <div class="row">
                            <div class="col-12 ">
                                <div class="search-input">
                                    1. 工具页是用于代码练习、绘画和多人合作的页面，你可以一个人在这里孤独的写着代码，
                                    也可以邀请你的朋友和你一起组排写代码。
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-input">
                                    2. 文章页则是提供其他用户所发布的文章，当然你也可以发布自己的文章，
                                    文章页还提供了评论功能，可以对文章进行评论。
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-input">
                                    3. 直播页则是可以观看教师直播的页面，你可以在这里观看自己喜欢的教师直播。
                                    也可以找对应课程的直播。
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-btn button">
                                    <button class="btn" @click="handleClick">一个平平无奇的按钮罢了~</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ElMessageBox } from 'element-plus';
import Header from '../components/header/index.vue'
const handleClick = () => {
    ElMessageBox
        .alert('应该不会有人闲着无聊点这个按钮吧 AwA', '提示', {
            confirmButtonText: '确定',
        })
}
</script>
<style lang="scss" scoped></style>