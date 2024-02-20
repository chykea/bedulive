<template>
    <Header />
    <!-- <Breadcrumb /> -->
    <section class="section blog-single">
        <div class="container">
            <div class="row">
                <div class="col-lg-8  col-12">
                    <div class="single-inner">
                        <div class="post-thumbnils">
                            <video width="840" id="screen" controls autoplay muted />
                            <!-- <audio id="sounds" controls /> -->
                        </div>
                        <div class="control" v-if="identityRef !== '1'">
                            <!-- <button @click="openScreen">开启桌面</button> -->
                            <!-- <button @click="openCemare">开启摄像头</button> -->
                            <!-- <button @click="openSounds">开启声音</button> -->
                            <button @click="startLive">开始直播</button>
                        </div>
                    </div>
                </div>
                <aside class="col-lg-4  col-12">
                    <!-- <video width="320" id="camera" autoplay muted /> -->
                    <div class="messages-body">
                        <div>
                            <div class="chat-list">
                                <ul class="single-chat-head">
                                    <li class="left">
                                        <img src="/src/assets/images/messages/image1.jpg" alt="#">
                                        <p class="text">Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry.
                                            <span class="time">9:51 AM</span>
                                        </p>
                                    </li>
                                    <li class="right">
                                        <img src="/src/assets/images/messages/image2.jpg" alt="#">
                                        <p class="text">Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry.
                                            <span class="time">11:00 AM</span>
                                        </p>
                                    </li>
                                    <li class="left">
                                        <img src="/src/assets/images/messages/image1.jpg" alt="#">
                                        <p class="text">Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry.
                                            <span class="time">12:00 AM</span>
                                        </p>
                                    </li>
                                    <li class="right">
                                        <img src="/src/assets/images/messages/image2.jpg" alt="#">
                                        <p class="text">Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry.
                                            <span class="time">12:25 AM</span>
                                        </p>
                                    </li>
                                </ul>
                                <div class="reply-block">
                                    <ul class="add-media-list">
                                        <li><a href="javascript:void(0)"><i class="lni lni-link"></i></a></li>
                                        <li><a href="javascript:void(0)"><i class="lni lni-image"></i></a></li>
                                    </ul>
                                    <input name="reply" type="text" placeholdlker="Type your message here...">
                                    <button class="reply-btn"><img src="/src/assets/images/messages/send.svg"
                                            alt="#"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</template>
<script setup>

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPushURL, getPlayerURL } from '../../request'
import { getInfo } from '../../utils/util'
const route = useRoute();
const identity = getInfo()?.identity || '1'

const identityRef = ref(identity)

let sdk = null
// identityRef.value === '1' ? sdk = new SrsRtcPlayerAsync() : sdk = new SrsRtcPublishAsync();
onMounted(async () => {
    if (identityRef.value === '1') {
        if (sdk) {
            sdk.close()
        }
        sdk = new SrsRtcPlayerAsync();
        let roomId = route.query.roomId
        const { data: { result } } = await getPlayerURL(roomId)
        // webrtc://192.168.106.130/bedulive/8adfc900-c64c-11ee-a36b-9f7cab65ec99
        sdk.play(result.stream_url)
        document.getElementById('screen').srcObject = sdk.screen
        // document.getElementById('sounds').srcObject = sdk.audio

    }
})

// 下面这些函数，如果用户不是教师的话是不会执行的(v-if控制)
let startLive = async () => {
    if (sdk) {
        sdk.close()
    }

    sdk = new SrsRtcPublishAsync();
    const { data: { result } } = await getPushURL()

    try {
        let session = await sdk.publish(result.stream_url)
        document.getElementById('screen').srcObject = sdk.screen
        // document.getElementById('sounds').srcObject = sdk.audio

    } catch (e) {
        console.log(e);
        sdk.close()
        sdk = new SrsRtcPublishAsync()
    }
}

</script>
<style lang='scss' scoped>
.single-inner {
    margin-top: 30px;
}
</style>