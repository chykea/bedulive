<template>
    <div class="col-lg-3 col-md-6 col-12">
        <router-link :to="`/live?roomId=` + teacher.uid" style="width: 100%;">
            <div class="single-item-grid">
                <div class="image">
                    <el-avatar :size="100">{{ teacher.user.nick_name }}</el-avatar>
                </div>
                <div class="content">
                    <a href="javascript:void(0)" class="tag">{{ teacher.user.nick_name }}</a><br />
                    <a href="javascript:void(0)" class="tag">@{{ teacher.user.user_name }}</a>
                    <h3 class="title">
                        {{ teacher.title }}
                    </h3>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
const props = defineProps({
    teacher: Object
})
</script>
<style lang='scss' scoped></style>