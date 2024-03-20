import http from '../../utils/request'
import qs from 'qs'
const prefix = '/users'
// 登录
function login(params) {
    return http.post(prefix + '/login', params)
}
// 注册
function register(params) {
    return http.post(prefix + '/register', params)
}
// 修改密码
function changePassword(params) {
    return http.post(prefix + '/changePassword', params)
}
// 修改个人信息
function changeInfo(params) {
    return http.post(prefix + '/changeInfo', params)
}


export {
    login,
    register,
    changePassword,
    changeInfo,

}