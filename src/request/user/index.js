import http from '../../utils/request'
import qs from 'qs'
const prefix = '/users'
// 登录
function login(params) {
    return http.post(prefix + '/login', qs.stringify(params))
}
// 注册
function register(params) {
    return http.post(prefix + '/register', qs.stringify(params))
}
// 获取用户信息
function getUserInfo(params) {
    return http.get(prefix + '/info', qs.stringify(params))
}
export {
    login,
    register,
    getUserInfo
}