import { defineStore } from 'pinia'
import { ref } from 'vue'

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




