import { defineStore } from 'pinia'
// 用setup语法写store
// 变量用ref定义,方法正常定义,getter用computed定义
import { ref, computed } from 'vue'

export const useRootStore = defineStore('rootStore', () => {
    const token = ref('')
    const userInfo = ref(null)
    return { token, userInfo }
}, {
    persist: {
        enabled: true, // 启用 persist
        strategies: [{
            key: "user",
            storage: sessionStorage, // 存储的地方
            paths: ["token", "userInfo"]
        }]
    }
})

// 用于创建房间传输代码
export const useToolStore = defineStore('toolStore', () => {
    const roomId = ref('')
    const connect = ref(false) // 是否已加入房间
    const userList = ref([])

    const language = ref('')
    return { language, connect, roomId, userList }
})
export const useCodeStore = defineStore('codeStore', () => {
    const code = ref('')
    return { code }
})

// 画板
export const useCanvaStore = defineStore('canvaStore', () => {
    const imgSrc = ref('')
    return { imgSrc }
})




