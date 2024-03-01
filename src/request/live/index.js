import http from '../../utils/request'
import qs from 'qs'
const prefix = '/live'

function getLiveList() {
    return http.get(prefix + '/getLiveList')
}
function getLiveRoom(params) {
    return http.get(prefix + '/getLiveRoom' + `?roomId=${params}`)
}
function getPlayerURL(params) {
    return http.get(prefix + '/getPlayerURL' + `?roomId=${params}`)
}
function getPushURL() {
    return http.get(prefix + '/getPushURL')
}
function setLiveInfo(params) {
    return http.post(prefix + '/setLiveInfo', qs.stringify(params))
}
export {
    getLiveList, setLiveInfo,
    getPushURL, getPlayerURL,
    getLiveRoom,
}