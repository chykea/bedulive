<template>
    <Header />
    <Breadcrumb />
    <router-view></router-view>
</template>

<route>
    {
        name:'acticle',
        meta:{title:'文章中心'}
    }
</route>

<script setup>
import Header from '../components/header/index.vue'
import Breadcrumb from '../components/breadcrumb/index.vue'


</script>

<style lang='scss' scoped></style>