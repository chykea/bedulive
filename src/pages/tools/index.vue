<template>
    <Header />
    <section class="section tools-outer">
        <div class="container tools">
            <div class="category-grid-topbar">
                <div class="row align-items-center">
                    <div class="col-12">
                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <button class="nav-link" id="nav-grid-tab" title="编辑器" @click="component = 'Editor'"><i
                                        class="lni lni-grid-alt"></i></button>
                                <button class="nav-link" id="nav-list-tab" title="画板"
                                    @click="component = 'DrawBroad'"><i class="lni lni-list"></i></button>

                            </div>
                        </nav>
                        <div class="connect" v-if="userInfo && JSON.stringify(userInfo) !== '{}'">
                            <el-button @click="shareCode" :disabled="roomStore.connect">创建房间</el-button>
                            <el-button @click="joinRoom" :disabled="roomStore.connect">加入房间</el-button>
                            <el-button @click="leaveRoom" :disabled="!roomStore.connect">离开房间</el-button>
                            <div class="room-tip" v-show="roomStore.roomId">
                                <span>房间号：{{ roomStore.roomId }}</span>
                                <span>当前用户</span>
                                <div class="user-list">
                                    <div v-for="item in roomStore.userList" :key="item.uid" class="avatar">
                                        <el-avatar :src="item.avatar_url" :size="50" />
                                        <span class="user_name">{{ item.nick_name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <keep-alive>
                <component :is="map.get(component)"></component>
            </keep-alive>
        </div>
    </section>
</template>

<script setup>
import Header from '../../components/header/index.vue'
import { ref, defineAsyncComponent, watchEffect, onBeforeUnmount } from 'vue'
import { useRootStore, useToolStore, useCodeStore, useCanvaStore } from '../../store';
import { getSocket } from '../../utils/socket'
const store = useRootStore()
const roomStore = useToolStore()
const codeStore = useCodeStore()
const canvaStore = useCanvaStore()
const userInfo = ref({})
const client = getSocket(import.meta.env.VITE_SOCKET_URL + '/tool')

watchEffect(() => {
    userInfo.value = store.userInfo
})
// 组件渲染
const component = ref('Editor')
const EditorAsync = defineAsyncComponent({
    loader: () => import('../../components/editor/local.vue'),
    loadingComponent: () => import('../../components/loading/index.vue'),
    errorComponent: () => import('../../components/error/index.vue'),
    delay: 10000,
    timeout: 20000
})
const DrawBroadAsync = defineAsyncComponent({
    loader: () => import('../../components/drawbroad/local.vue'),
    loadingComponent: () => import('../../components/loading/index.vue'),
    errorComponent: () => import('../../components/error/index.vue'),
    delay: 10000,
    timeout: 20000
})
const map = new Map([
    ['Editor', EditorAsync],
    ['DrawBroad', DrawBroadAsync]
])
// 加入房间
const joinRoom = () => {
    ElMessageBox.prompt('请输入房间号', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
    })
        .then(({ value }) => {
            if (!client.isConnected) {
                client.connect()
            }
            roomStore.roomId = value
            client.socket.emit('joinRoom', { roomId: value, user: userInfo.value })
        })

}
// 开启房间
const shareCode = () => {
    // 如果socket没有连接时
    if (!client.isConnected) {
        client.connect()
    }
    // 首先用户要先加入房间
    roomStore.connect = true
    roomStore.roomId = userInfo.value.uid
    roomStore.userList = [userInfo.value]
    client.socket.emit('createRoom', { roomId: userInfo.value.uid, user: userInfo.value, code: codeStore.code, imgSrc: canvaStore.imgSrc })
    ElMessageBox.alert(`房间号为：${roomStore.roomId}`, '共享代码', {
        confirmButtonText: 'OK',
    })
}
// 用户填写房间号,后端要判断房间是否存在,不存在要返回不存在该房间号
client.socket.on('roomNotExist', () => {
    ElMessageBox.alert(`房间号不存在`, {
        confirmButtonText: 'OK',
    })
    roomStore.roomId = ''
})
const leaveRoom = () => {
    client.socket.emit('leaveRoom', { roomId: roomStore.roomId, user: userInfo.value })
    roomStore.connect = false
    roomStore.roomId = ''
    roomStore.userList = []
    // 关闭连接
    client.disconnect()
}
// 成功加入房间
client.socket.on('successJoin', (data) => {
    roomStore.connect = data.connect
    roomStore.roomId = data.roomId;
    roomStore.userList = data.userList;
})
// 有用户加入/离开房间
client.socket.on('userJoin', (data) => {
    roomStore.userList = data.userList;
})
client.socket.on('userLeave', (data) => {
    roomStore.userList = data.userList;
})
// 房主离开
client.socket.on('roomOwnerLeave', (data) => {
    leaveRoom()
    ElMessageBox.alert(`房主 ${data.user.nick_name} 离开了房间`, {
        confirmButtonText: 'OK',
    })
})
// 页面关闭时离开房间
window.onunload = () => {
    leaveRoom()
    window.onunload = null
}
// 切换模块之后离开房间
onBeforeUnmount(() => {
    leaveRoom()
})
// 需要在这里接收绘画信息
client.socket.on('receiveImg', (data) => {
    canvaStore.imgSrc = data.imgSrc
})

</script>

<style lang='scss' scoped>
.tools-outer {
    background-color: #f9f9f9;
}

.tools {
    height: 690px;
}

.connect {
    margin-top: 10px;
}

.room-tip {
    display: flex;
    flex-direction: column;

    .user-list {
        .avatar {

            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .user_name {
            text-align: center;
            width: 56px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

        }
    }
}
</style>