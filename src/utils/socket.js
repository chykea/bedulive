import { io } from "socket.io-client";
class createSocket {
    socket = null
    // url为socket服务地址
    constructor(url = import.meta.env.VITE_SOCKET_URL) {
        this.socket = io(url)
    }

    join(config) {
        if (config.roomId == '') {
            console.log('没有房间号');
            return
        }
        this.socket.emit('join', config)
    }
    leave(roomId) {
        if (!roomId) return
        this.socket.emit('leave', roomId)
    }
    // 这里会获取输入框的字符串
    sendMsg({ roomId, msg, user }) {
        if (!msg) return
        return new Promise((resolve, reject) => {
            this.socket.emit('sendMsg', { type: 'chat', roomId, user, msg }, (data) => {
                resolve(data)
            })
        })
    }
    sendCode({ roomId, code, user }) {
        // if (!code) return
        return new Promise((resolve, reject) => {
            this.socket.emit('sendMsg', { type: 'code', roomId, user, code }, (data) => {
                resolve(data)
            })
        })
    }
    openShare({ roomId, user, isShare }) {
        return new Promise((resolve, reject) => {
            this.socket.emit('openShare', { roomId, user, isShare }, (data) => {
                resolve(data)
            })
        })
    }
    sendPaint({ roomId, user, data }) {
        return new Promise((resolve, reject) => {
            this.socket.emit('sendPaint', { roomId, user, data }, (data) => {

            })
        })
    }
}
function initSocket() {
    let socket = null
    return () => {
        if (!socket) {
            socket = new createSocket()
        }
        return socket
    }
}
const getSocket = initSocket()
// export default new createSocket()
export { getSocket }