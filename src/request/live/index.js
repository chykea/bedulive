import http from '../../utils/request'
import qs from 'qs'
const prefix = '/live'

function getLiveList(params) {

}
function getPlayerURL(params) {
    return http.get(prefix + '/getPlayerURL' + `?roomId=${params}`)
}
function getPushURL() {
    return http.get(prefix + '/getPushURL')
}
export {
    getLiveList,
    getPushURL, getPlayerURL
}