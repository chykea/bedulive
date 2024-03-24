import http from '../../utils/request'
const prefix = '/liveStudent'

// 获取用户订阅的所有直播间
const getAllSubscriptRoom = (params) => {
    return http.get(`${prefix}/getUserLiveRoom?page=${params.page}`)
}
// 获取用户是否订阅了当前直播间
const getIsSubscribe = (params) => {
    return http.get(`${prefix}/isSubscribe?lid=${params.lid}`)
}
// 用户订阅直播间
const subscribeLiveRoom = (params) => {
    return http.post(`${prefix}/subscribeLiveRoom`, params)
}
// 用户取消订阅
const quitSubscribe = (params) => {
    return http.post(`${prefix}/unsubscribeLiveRoom`, params)
}



export { getAllSubscriptRoom, subscribeLiveRoom, quitSubscribe, getIsSubscribe }