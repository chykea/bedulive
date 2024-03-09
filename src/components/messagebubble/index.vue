<template>
    <div style="margin: 10px 0;">
        <li :class="isOwn ? 'right' : 'left'">
            <el-avatar class="head" :src="user.avatar_url"> {{ isOwn ? 'you' : user.nick_name }}</el-avatar>
            <p class="text">{{ msg }} </p>
        </li>
    </div>
</template>
<script setup>

const props = defineProps({
    msg: String,
    user: Object,
    isOwn: {
        type: Boolean,
        default: false
    }
})

</script>
<style scoped>
.left .head {
    height: 40px;
    width: 40px;
    line-height: 30px;
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    border-radius: 50%;
}

.right .head {
    height: 40px;
    width: 40px;
    line-height: 35px;
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
}
</style>