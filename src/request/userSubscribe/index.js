import http from '../../utils/request'
const prefix = '/user_subscribe'

// 获取用户订阅的所有用户
const getUserSubscribeList = (params) => {
    return http.get(`${prefix}/getUserSubscribe?page=${params.page}`)
}
// 获取用户是否订阅了当前用户
const getUserIsSubscribe = (params) => {
    return http.get(`${prefix}/getIsSubscribe?sub_uid=${params.sub_uid}`)
}
// 用户订阅
const subscribeUser = (params) => {
    return http.post(`${prefix}/setSubscribe`, params)
}
// 用户取消订阅
const cancelSubscribeUser = (params) => {
    return http.post(`${prefix}/cancelSubscribe`, params)
}

export {
    getUserSubscribeList,
    getUserIsSubscribe,
    subscribeUser,
    cancelSubscribeUser
}
