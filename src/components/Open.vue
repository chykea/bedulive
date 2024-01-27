<template>
    <div>
        <div id="live_local"></div>
        <div>
            <!-- <button @click="shareDesktop"> 开启共享桌面</button> -->
            <!-- <button @click="changeCamera(toggleCamera)">{{ toggleCamera ? '关闭' : '开启' }}摄像头</button> -->
            <video id="rtc_media_play" autoplay muted></video>
            <button @click="changeDesktop(toggleDesktop)">{{ toggleDesktop ? '关闭' : '开启' }}共享桌面</button>
            <button @click="changeAudio(toggleAudio)">{{ toggleAudio ? '关闭' : '开启' }}声音</button>
            <button @click="startPush">开始推流</button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
const toggleCamera = ref(false)
const toggleDesktop = ref(false)
const toggleAudio = ref(false)

let startPush = null


onMounted(() => {
    $('#rtc_media_play').show();
    let sdk = null;
    startPush = () => {
        if (sdk) {
            sdk.close()
        }
        sdk = new SrsRtcPublisherAsync({
            audio: true,

        });
        // video播放流
        $('#rtc_media_play').prop('srcObject', sdk.stream);

        sdk.pc.onicegatheringstatechange = (e) => {


        }
    }
})




</script>
<style scoped>
#live_local {
    width: 500px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>