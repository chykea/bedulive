<template>
    <div class="error-area">
        <div class="d-table">
            <div class="d-table-cell">
                <div class="container">
                    <div class="error-content">
                        <h1>404</h1>
                        <h2>出现了一些问题</h2>
                        <p>你请求的页面找不到哟</p>
                        <div class="button">
                            <!-- <route href="index.html" class="btn">Go To Home</route> -->
                            <router-link to="/" class="btn">返回首页</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style lang='scss' scoped></style>