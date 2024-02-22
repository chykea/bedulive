import { io } from "socket.io-client";
class createSocket {
    socket = null
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
    sendMsg({ type, roomId, msg, user }) {
        if (!msg) return
        return new Promise((resolve, reject) => {
            this.socket.emit('sendMsg', { type, roomId, user, msg }, (data) => {
                resolve(data)
            })
        })

    }

}

export default new createSocket()