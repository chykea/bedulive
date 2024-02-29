<template>
    <div class="col-lg-3 col-md-6 col-12">
        <router-link :to="`/live?roomId=` + teacher.uid">
            <div class="single-item-grid">
                <div class="image">
                    <el-avatar>user</el-avatar>
                </div>
                <div class="content">
                    <a href="javascript:void(0)" class="tag">Mobile</a>
                    <h3 class="title">
                        <a href="item-details.html">Apple Iphone X</a>
                    </h3>
                    <p class="location"><a href="javascript:void(0)"><i class="lni lni-map-marker">
                            </i>Boston</a></p>
                    <ul class="info">
                        <li class="price">$890.00</li>
                        <li class="like"><a href="javascript:void(0)"><i class="lni lni-heart"></i></a>
                        </li>
                    </ul>
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
onMounted(() => {
    console.log(props.teacher);
})
</script>
<style lang='scss' scoped></style>