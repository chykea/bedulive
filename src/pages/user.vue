<template>
    <div class="user-container">
        <router-view></router-view>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


</script>
<style lang='scss' scoped>
.user-container {}
</style>