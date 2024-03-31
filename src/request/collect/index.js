import http from '../../utils/request'
const prefix = '/collection'
// 收藏与取消
function collectArticle(params) {
    return http.post(prefix + '/addCollection', params)
}
function removeCollectArticle(params) {
    return http.get(prefix + '/removeCollection?aid=' + params.aid)
}
// 获取收藏
function isCollect(params) {
    return http.get(prefix + '/getCollection?aid= ' + params.aid)
}
function getAllCollect(params) {
    return http.get(prefix + '/getCollections?page=' + params.page)
}

export {
    collectArticle,
    removeCollectArticle,
    isCollect,
    getAllCollect
}