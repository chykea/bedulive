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
              <el-button class="custom-el-btn-color" plain @click="openDrawBroad">画板</el-button>
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
    <el-button class="custom-el-btn-color" v-if="identity !== '1'" @click="openShare">{{ !isShare ? "开启" : "关闭"
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
import { onMounted, ref, watch, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { getPushURL, getPlayerURL, setLiveInfo, getLiveRoom } from "../../request";
import { getInfo, debounce } from "../../utils/util";
import { getSocket } from "../../utils/socket";
const client = getSocket();
const route = useRoute();
const userInfo = getInfo();
const identity = userInfo?.identity || "1";

const Editor = defineAsyncComponent({
  loader: () => import("../../components/editor/index.vue"),
  loadingComponent: () => import("../../components/loading/index.vue"),
  errorComponent: () => import("../../components/error/index.vue"),
  delay: 2000,
  timeout: 5000,
});
const DrawBroad = defineAsyncComponent({
  loader: () => import("../../components/drawbroad/index.vue"),
  loadingComponent: () => import("../../components/loading/index.vue"),
  errorComponent: () => import("../../components/error/index.vue"),
  delay: 2000,
  timeout: 5000,
});

let sdk = ref(null);
const msg = ref("");
const code = ref("");
let isReadOnly = ref(false);

let roomId = route.query.roomId || userInfo.uid;
const messageBox = ref([]);
let roomInfo = ref({});

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
  const { data } = await getLiveRoom(roomId);
  roomInfo.value = data.res;
  // 不是主播就进行拉流
  if (roomId !== userInfo.uid) {
    showVideoMark.value = false;
    if (sdk.value) {
      sdk.value.close();
    }

    sdk.value = new SrsRtcPlayerAsync();

    const { data: { result } } = await getPlayerURL(roomId);
    sdk.value.play(result.stream_url).then(() => {
      document.getElementById("screen").srcObject = sdk.value.screen;
    }).catch((err) => {
      console.log(1);
      showVideoMark.value = true;

    })

  }
  client.join({
    user: userInfo,
    roomId: roomId,
  });
  client.socket.on("getMsg", (data) => {
    messageBox.value.push({ msg: data.msg, user: data.user });
  });
  // 收到代码
  client.socket.on("getCode", (data) => {
    code.value = data.code; // 用于保存学生端打开初始化的值
  });
  client.socket.on("share", (data) => {
    isReadOnly.value = data.readOnly;
  });
});

// 刷新
const reload = async () => {
  if (sdk.value) {
    showVideoMark.value = false;
    const { data: { result } } = await getPlayerURL(roomId);
    sdk.value.play(result.stream_url).then(() => {
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
  const { data: { result } } = await getPushURL();
  console.log(result);
  try {
    let session = await sdk.value.publish(result.stream_url);
    document.getElementById("screen").srcObject = sdk.value.screen;
  } catch (e) {
    sdk.value.close();
  }
};

const closeLive = async () => {
  isLive.value = false;
  if (sdk.value.pc) {
    sdk.value.close();
    document.getElementById("screen").srcObject = null;
  }
};

const sendMessage = () => {
  client.sendMsg({ roomId, msg: msg.value, user: userInfo }).then((res) => {
    if (res.code === "200") {
      messageBox.value.push({ msg: msg.value, user: userInfo, isOwn: true });
      msg.value = "";
    }
  });
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
const isShare = ref(false);
const openShare = () => {
  isShare.value = !isShare.value;
  client.openShare({ roomId, user: userInfo, isShare: isShare.value });
};

const openDrawBroad = () => {
  showDrawBroad.value = true;
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
      uid: userInfo.uid,
      title: roomInfo.value.title,
    };
    // console.log(params);
    const { data } = await setLiveInfo(params);
    if (data.code == "0") {
      isUpdate.value = !isUpdate.value;
      ElMessage.success("修改成功");
      client.socket.emit("updateRoomInfo", { roomId, roomInfo: params });
    }
  }
};
client.socket.on("updateRoom", (data) => {
  roomInfo.value.title = data.title;
});

const currentUser = ref(0);
client.socket.on("currentUser", (data) => {
  currentUser.value = data;
});
window.onunload = () => {
  client.leave(roomId);
  window.onunload = null;
};
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
