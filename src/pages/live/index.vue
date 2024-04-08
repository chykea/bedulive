<template>
  <Header />
  <section class="section blog-single">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-12">
          <div class="single-inner">
            <div class="post-details">
              <div class="detail-inner">
                <h2 class="post-title" v-show="!isUpdate">{{ roomInfo.title }}</h2>
                <el-input v-model="roomInfo.title" v-show="isUpdate"></el-input>
                <span style="vertical-align: middle">当前老师:{{ roomInfo.user && roomInfo.user.nick_name }}</span>
                <el-button v-if="identity !== '1' && roomId == userInfo.uid" plain style="margin-left: 10px"
                  class="custom-el-btn-color" @click="updateRoomInfo">{{ isUpdate ? "确认" : "修改标题" }}</el-button>
                <el-button plain style="margin-left: 10px" class="custom-el-btn-color" @click="handleSubscribe">{{
                  subScribe ? "取消订阅" : "订阅" }}</el-button>
                <p><span>当前在线人数:</span>{{ currentUser }}</p>
              </div>
            </div>
            <div class="post-thumbnils">
              <div class="video-box">
                <video id="screen" controls autoplay muted />
                <div class="video-mark" v-show="showVideoMark">
                  <span>当前没有直播哟~</span>
                  <a href="javascript:void(0)" @click="reload">重新加载</a>
                </div>
              </div>
            </div>
            <div class="control">
              <el-button class="custom-el-btn-color" :disabled="isLive"
                v-if="identity !== '1' && roomId == userInfo.uid" plain @click="startLive">开始直播</el-button>
              <el-button class="custom-el-btn-color" :disabled="!isLive"
                v-if="identity !== '1' && roomId == userInfo.uid" plain @click="closeLive">关闭直播</el-button>
              <el-button class="custom-el-btn-color" plain @click="showEditor = true">代码编辑器</el-button>
              <el-button class="custom-el-btn-color" plain @click="showDrawBroad = true">画板</el-button>
            </div>
          </div>
        </div>
        <aside class="col-lg-4 col-12">
          <div class="messages-body">
            <div>
              <div class="chat-list">
                <ul class="single-chat-head message-box">
                  <template v-for="item in messageBox">
                    <MessageBubble :msg="item.msg" :user="item.user" :is-own="item.isOwn" />
                  </template>
                </ul>
                <div class="reply-block">
                  <input v-model="msg" name="reply" type="text" placeholdlker="发现消息" />
                  <button @click="sendMessage" class="reply-btn">
                    <img src="/src/assets/images/messages/send.svg" alt="#" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
  <el-dialog overflow draggable v-model="showEditor" title="editor" width="1000" append-to-body>
    <el-select v-if="identity !== '1'" v-model="initLanguage" class="m-2" placeholder="Select" size="small"
      style="width: 240px" @change="changeEditorLanguage">
      <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-button class="custom-el-btn-color" v-if="identity !== '1'" @click="handleShare">{{ readOnly ? "开启" : "关闭"
      }}共享编辑</el-button>
    <div class="editor-box">
      <Editor ref="editor" :isReadOnly="isReadOnly" :code="code" />
    </div>
  </el-dialog>
  <el-dialog draggable v-model="showDrawBroad" title="drawbroad" width="1000" append-to-body>
    <DrawBroad ref="drawBroad" :initImage="initImage" />
  </el-dialog>
</template>

<script setup>
import MessageBubble from "../../components/messagebubble/index.vue";
import { onMounted, ref, watch, defineAsyncComponent, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { getPushURL, getPlayerURL, setLiveInfo, getLiveRoom, getIsSubscribe, quitSubscribe, subscribeLiveRoom } from "../../request";
import flvjs from 'flv.js'
import { getInfo, debounce } from "../../utils/util";
import { getSocket } from "../../utils/socket";
const client = getSocket(import.meta.env.VITE_SOCKET_URL + '/live');
const route = useRoute();
const userInfo = getInfo();
const identity = userInfo?.identity || "1";

const Editor = defineAsyncComponent({
  loader: () => import("../../components/editor/index.vue"),
  loadingComponent: () => import("../../components/loading/index.vue"),
  errorComponent: () => import("../../components/error/index.vue"),
  delay: 5000,
  timeout: 10000,
});
const DrawBroad = defineAsyncComponent({
  loader: () => import("../../components/drawbroad/index.vue"),
  loadingComponent: () => import("../../components/loading/index.vue"),
  errorComponent: () => import("../../components/error/index.vue"),
  delay: 5000,
  timeout: 10000,
});

let sdk = ref(null);
// 聊天信息
const msg = ref("");
// 代码编辑器的代码
const code = ref("");
// 是否只读(教师控制学生端编辑)
let isReadOnly = ref(false);

let roomId = route.query.roomId || userInfo.uid;
const messageBox = ref([]);
let roomInfo = ref({});
let subScribe = ref(false);

const showEditor = ref(false);
const showDrawBroad = ref(false);
const editor = ref();
const drawBroad = ref();
const initLanguage = ref("javascript");
const languageOptions = [
  {
    value: "html",
    label: "html",
  },
  {
    value: "css",
    label: "css",
  },
  {
    value: "javascript",
    label: "javascript",
  },
  {
    value: "typescript",
    label: "typescript",
  },
  {
    value: "json",
    label: "json",
  },
];
const showVideoMark = ref(false);
onMounted(async () => {
  // 获取直播间信息
  roomInfo.value = await handleGetLiveRoom();
  // 获取是否订阅
  subScribe.value = await hanldeGetIsSubscribe();
  // 创建socket连接
  client.connect()
  client.socket.emit('joinLive', { roomId, user: userInfo });
  // 不是主播就进行拉流
  if (roomId !== userInfo.uid) {

    /* if (flvjs.isSupported()) {
      // 能播放,但是很卡
      showVideoMark.value = false;
      const flvPlayer = flvjs.createPlayer({
        type: "flv",
        url: `https://192.168.106.130/bedulive/${roomId}.flv`,
      })
      flvPlayer.attachMediaElement(document.getElementById("screen"));
      flvPlayer.load();
      flvPlayer.play();
    } */


    showVideoMark.value = false;
    if (sdk.value) {
      sdk.value.close();
    }
    sdk.value = new SrsRtcPlayerAsync();
    const streamURL = import.meta.env.VITE_STREAM_URL + `/${roomId}`
    try {
      await sdk.value.play(streamURL)
      document.getElementById("screen").srcObject = sdk.value.screen;
    } catch (e) {
      showVideoMark.value = true;
      sdk.value.close();
    }
  }
});

// 是否订阅
const hanldeGetIsSubscribe = async () => {
  const { data } = await getIsSubscribe({ lid: roomInfo.value.id })
  return data.res
}
// 获取直播间信息
const handleGetLiveRoom = async () => {
  const { data } = await getLiveRoom(roomId);
  return data.res;
}
// 处理取消订阅
const handleQuitSubscribe = async () => {
  const { data } = await quitSubscribe({ lid: roomInfo.value.id })
  return data
}
// 处理订阅
const handleSubscribeLiveRoom = async () => {
  const { data } = await subscribeLiveRoom({ lid: roomInfo.value.id })
  return data
}
// 订阅与取消订阅操作
const handleSubscribe = async () => {
  if (userInfo.uid === roomId) {
    ElMessage.error("不能订阅自己的直播间")
    return
  }
  // 订阅直播间
  if (subScribe.value) {
    ElMessageBox.confirm(
      '真的要取消订阅吗？',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        const data = await handleQuitSubscribe()
        if (data.code === '0') {
          ElMessage({
            message: '取消成功',
            type: 'success',
            duration: 1000,
            onClose: async () => {
              subScribe.value = await hanldeGetIsSubscribe()
            }
          })
        }
      })
      .catch(() => {
      })
  } else {
    const data = await handleSubscribeLiveRoom()
    if (data.code === '0') {
      ElMessage({
        message: '订阅成功',
        type: 'success',
        duration: 1000,
      })
      subScribe.value = data.res
    }
  }
}

// 刷新直播
const reload = async () => {
  if (sdk.value) {
    showVideoMark.value = false;
    const streamURL = import.meta.env.VITE_STREAM_URL + `/${roomId}`
    sdk.value.play(streamURL).then(() => {
      document.getElementById("screen").srcObject = sdk.value.screen;
    }).catch((err) => {
      showVideoMark.value = true
    })
  }
};

const isLive = ref(false);
const startLive = async () => {
  isLive.value = true;
  if (sdk.value) {
    sdk.value.close();
  }

  sdk.value = new SrsRtcPublishAsync();
  const streamURL = import.meta.env.VITE_STREAM_URL + `/${roomId}`
  try {
    await sdk.value.publish(streamURL);
    document.getElementById("screen").srcObject = sdk.value.screen;
  } catch (e) {
    sdk.value.close();
    isLive.value = false;
  }
};

const closeLive = async () => {
  isLive.value = false;
  if (sdk.value.pc) {
    sdk.value.close();
    const tracks = document.getElementById("screen").srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    document.getElementById("screen").srcObject = null;
  }
};

// 直播间的聊天与多人协同功能
client.socket.on("getMsg", (data) => {
  messageBox.value.push({ ...data, isOwn: false });
})
// 收到代码
client.socket.on("getCode", ({ code: c }) => {
  code.value = c;
});
client.socket.on("share", ({ readOnly }) => {
  isReadOnly.value = readOnly
});

const sendMessage = () => {
  client.socket.emit('sendMsg', ({ roomId, msg: msg.value, user: userInfo }))
  messageBox.value.push({ msg: msg.value, user: userInfo, isOwn: true });
  msg.value = "";
};
// 消息超过50条时，删除最旧一条
watch(
  () => messageBox.value.length,
  (newVal, oldVal) => {
    if (newVal > 50) {
      messageBox.value.shift();
    }
  }
);

const changeEditorLanguage = (e) => {
  editor.value.changeLanguage(e);
};

// 开启/关闭共享编辑
const readOnly = ref(true);
const handleShare = () => {
  readOnly.value = !readOnly.value;
  client.socket.emit('openShare', { roomId, readOnly: readOnly.value })
};
const initImage = ref("");
client.socket.on("initImage", (data) => {
  if (!data) return;
  initImage.value = data.imgSrc;
});
client.socket.on("initCode", (data) => {
  if (!data) return;
  code.value = data.code; // 用于保存学生端打开初始化的值
});
client.socket.on("initSetting", (data) => {
  // 如果没有编辑过,并且不是教师端
  if (!data && identity == "1") {
    // 编辑器则为只读
    isReadOnly.value = true;
    return;
  }
  // 只控制学生端
  if (identity == "1") {
    isReadOnly.value = data.readOnly;
  }
});

const isUpdate = ref(false);
const updateRoomInfo = async () => {
  if (!isUpdate.value) {
    isUpdate.value = !isUpdate.value;
  } else {
    const params = {
      uid: roomInfo.value.uid,
      title: roomInfo.value.title,
    };
    const { data } = await setLiveInfo(params);
    if (data.code == "0") {
      isUpdate.value = !isUpdate.value;
      ElMessage.success("修改成功");
      client.socket.emit("updateRoomInfo", { roomId, roomInfo: { title: params.title } });
    }
  }
};
client.socket.on("updateRoom", ({ title }) => {
  roomInfo.value.title = title;
});

const currentUser = ref(0);
client.socket.on("currentUser", (data) => {
  currentUser.value = data;
});
window.onunload = () => {
  client.socket.emit("leaveLive", { roomId, user: userInfo });
  client.disconnect()
  window.onunload = null;
};
onBeforeUnmount(() => {
  client.socket.emit("leaveLive", { roomId, user: userInfo });
  client.disconnect()
})
</script>

<style lang="scss" scoped>
.single-inner {
  margin-top: 30px;
}

.control {
  margin-top: 10px;
}

.editor-box {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}

.video-box {
  position: relative;
  width: 100%;
  height: 100%;
}

#screen {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.video-box .video-mark {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #222;
  color: #eee;
  font-size: 16px;
  top: 0;
  left: 0;
}

.video-box video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
