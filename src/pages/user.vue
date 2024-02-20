<template>
    <Header />
    <router-view></router-view>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


</script>
<style lang='scss' scoped>
.user-container {}
</style>