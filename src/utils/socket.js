import { io } from "socket.io-client";
class createSocket {
    socket = null
    // url为socket服务地址
    constructor(url = import.meta.env.VITE_SOCKET_URL) {
        this.url = url
        // console.log(this.url);
        this.socket = io(url, { autoConnect: true }) // 自动连接
        this.isConnected = true
    }
    getCurrentURL() {
        return this.url
    }
    connect() {
        this.socket.connect()
        this.isConnected = true
    }
    disconnect() {
        this.socket.disconnect()
        this.isConnected = false
    }
}
function initSocket() {
    let socket = null
    return (url = '') => {
        if (!socket) {
            socket = new createSocket(url)
        }
        return socket
    }
}
const getSocket = initSocket()
// export default new createSocket()
export { getSocket }