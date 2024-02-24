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
                        <div class="control">
                            <el-button v-if="identity !== '1'" plain @click="startLive">开始直播</el-button>
                            <el-button plain @click="showEditor = true">代码编辑器</el-button>
                        </div>
                    </div>
                </div>
                <aside class="col-lg-4  col-12">
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
    <el-dialog v-model="showEditor" title="editor" width="1000" draggable overflow>
        <el-select v-if="identity !== '1'" v-model="initLanguage" class="m-2" placeholder="Select" size="small"
            style="width: 240px" @change="changeEditorLanguage">
            <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button v-if="identity !== '1'" @click="openShare">{{ !isShare ? '开启' : '关闭' }}共享编辑</el-button>
        <div class="editor-box">
            <Editor ref="editor" :isReadOnly="isReadOnly" :code="code" @mounted="watchCodeText"
                @unmounted="unCodeTextWatchFn" />
        </div>
        <!-- <template #footer>

            <div class="dialog-footer">

                <el-button @click="showEditor = false">Cancel</el-button>
                <el-button type="primary" @click="showEditor = false">
                    Confirm
                </el-button>
            </div>
        </template> -->
    </el-dialog>
</template>
<script setup>
import MessageBubble from '../../components/messagebubble/index.vue'
import Editor from '../../components/editor/index.vue'
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPushURL, getPlayerURL } from '../../request'
import { getInfo, debounce } from '../../utils/util'
import client from '../../utils/socket'
const route = useRoute();
const userInfo = getInfo()
const identity = userInfo?.identity || '1'

let sdk = null
const msg = ref('')
const code = ref('')
let isReadOnly = ref(identity === '1' ? true : false)

let roomId = route.query.roomId || userInfo.uid
const messageBox = ref([])

const showEditor = ref(false)
const editor = ref()
const initLanguage = ref('javascript')
const languageOptions = [
    {
        value: 'html',
        label: 'html',
    },
    {
        value: 'css',
        label: 'css',
    },
    {
        value: 'javascript',
        label: 'javascript',
    },
    {
        value: 'typescript',
        label: 'typescript',
    },
    {
        value: 'json',
        label: 'json',
    },
]

onMounted(async () => {
    // 是学生就进行拉流
    if (identity === '1') {
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

    client.socket.on('getMsg', (data) => {
        messageBox.value.push({ msg: data.msg, user: data.user })
    })
    // 收到代码
    client.socket.on('getCode', (data) => {
        code.value = data.code // 用于保存学生端打开初始化的值
        editor.value && editor.value.setEditorValue(code.value)
    })
    client.socket.on('share', (data) => {
        isReadOnly.value = data.readOnly;
        editor.value && editor.value.setReadOnly(isReadOnly.value);
    })
})

const startLive = async () => {
    if (sdk) {
        sdk.close()
    }

    sdk = new SrsRtcPublishAsync();
    const { data: { result } } = await getPushURL()

    try {
        let session = await sdk.publish(result.stream_url)
        document.getElementById('screen').srcObject = sdk.screen

    } catch (e) {
        console.log(e);
        sdk.close()
    }
}

const sendMessage = () => {
    client.sendMsg({ roomId, msg: msg.value, user: userInfo }).then(res => {
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

const changeEditorLanguage = (e) => {
    editor.value.changeLanguage(e)
}

let unCodeTextWatch = null
// 当编辑器组件挂载之后
const watchCodeText = () => {
    // 教师/学生的监听
    unCodeTextWatch = watch(() => editor.value.text, debounce((newVal, oldVal) => {
        client.sendCode({ roomId, code: newVal, user: userInfo }).then(res => { })
    }))
}
const unCodeTextWatchFn = () => {
    unCodeTextWatch && unCodeTextWatch()
}

// 开启/关闭共享编辑
const isShare = ref(false)
let shareWatch = null
const openShare = () => {
    isShare.value = !isShare.value
    client.openShare({ roomId, user: userInfo, isShare: isShare.value })
}

</script>
<style lang='scss' scoped>
.single-inner {
    margin-top: 30px;
}

.editor-box {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
}
</style>