import http from '../../utils/request'
import qs from 'qs'
const prefix = '/users'
export default {
    // 登录
    login(params) {
        return http.post(prefix + '/login', qs.stringify(params))
    },
    // 注册
    register(params) {
        return http.post(prefix + '/register', qs.stringify(params))
    }
}