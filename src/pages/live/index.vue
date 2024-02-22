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
                        </div>
                        <div class="control" v-if="identityRef !== '1'">
                            <button @click="startLive">开始直播</button>
                        </div>
                    </div>
                </div>
                <aside class="col-lg-4  col-12">
                    <!-- <video width="320" id="camera" autoplay muted /> -->
                    <div class="messages-body">
                        <div>
                            <div class="chat-list">
                                <ul class="single-chat-head message-box">
                                    <template v-for="(item) in messageBox">
                                        <!-- <div>{{ item }}</div> -->
                                        <MessageBubble :msg="item.msg" :user="item.user" :is-own="item.isOwn" />
                                    </template>
                                </ul>
                                <div class="reply-block">
                                    <input v-model="msg" name="reply" type="text" placeholdlker="发现消息">
                                    <button @click="sendMessage" class="reply-btn"><img
                                            src="/src/assets/images/messages/send.svg" alt="#"></button>
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
import MessageBubble from '../../components/messagebubble/index.vue'
import { onMounted, ref, h, render, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPushURL, getPlayerURL } from '../../request'
import { getInfo } from '../../utils/util'
import client from '../../utils/socket'
const route = useRoute();
const userInfo = getInfo()
const identity = userInfo?.identity || '1'
const identityRef = ref(identity)
let sdk = null
let msg = ref('')
let roomId = route.query.roomId || userInfo.uid
const messageBox = ref([])
onMounted(async () => {

    if (identityRef.value === '1') {
        if (sdk) {
            sdk.close()
        }
        sdk = new SrsRtcPlayerAsync();

        const { data: { result } } = await getPlayerURL(roomId)
        // webrtc://192.168.106.130/bedulive/8adfc900-c64c-11ee-a36b-9f7cab65ec99
        sdk.play(result.stream_url)
        document.getElementById('screen').srcObject = sdk.screen

    }

    client.join({
        user: userInfo,
        roomId: roomId
    })

    client.socket.on('connect', () => {
        // console.log('连接成功');
    })
    client.socket.on('getMsg', (data) => {
        messageBox.value.push({ msg: data.msg, user: data.user })
    })
})

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
    }
}

let sendMessage = () => {
    client.sendMsg({ type: 'chat', roomId, msg: msg.value, user: userInfo }).then(res => {
        if (res.code === '200') {
            messageBox.value.push({ msg: msg.value, user: userInfo, isOwn: true })
            msg.value = ''
        }
    })
}
// 消息超过50条时，删除最旧一条
watch(() => messageBox.value.length, (newVal, oldVal) => {
    if (newVal > 50) {
        messageBox.value.shift()
    }
})

</script>
<style lang='scss' scoped>
.single-inner {
    margin-top: 30px;
}
</style>