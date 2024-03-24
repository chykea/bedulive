import http from '../../utils/request'
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
// 管理员
function getUserList(params) {
    return http.get(prefix + '/list?page=' + params.page)
}
function banUser(params) {
    return http.get(prefix + '/ban?id=' + params.id)
}
function unbanUser(params) {
    return http.get(prefix + '/unbanUser?id=' + params.id)
}
function updateUser(params) {
    return http.post(prefix + '/update', params)
}

export {
    login,
    register,
    changePassword,
    changeInfo,
    getUserList,
    banUser,
    unbanUser,
    updateUser
}