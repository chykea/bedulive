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
// 修改密码
function changePassword(params) {
    return http.post(prefix + '/changePassword', qs.stringify(params))
}
// 修改个人信息
function changeInfo(params) {
    return http.post(prefix + '/changeInfo', qs.stringify(params))
}

// 上传头像
function uploadAvatar(params) {
    return http.post(prefix + '/uploadAvatar', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export {
    login,
    register,
    changePassword,
    changeInfo,
    uploadAvatar
}