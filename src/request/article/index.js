import http from '../../utils/request'
import qs from 'qs'
const prefix = '/article'

// 获取文章列表
function getAllArticle(params) {
    return http.get(prefix + '/getAllArticle?' + "page=" + params)
}
// 获取文章详情
function getArticle(params) {
    return http.get(prefix + '/getArticleDetail?' + "id=" + params)
}
// 获取用户发布过的文章
function getUserArticle(params) {
    return http.get(prefix + '/getUserArticle?' + "page=" + params)
}
// 删除用户的对应文章
function deleteArticle(params) {
    return http.get(prefix + '/deleteArticle?' + "id=" + params)
}
// 发布文章
function publishArticle(params) {
    return http.post(prefix + '/publish', qs.stringify(params))
}
// 更新文章内容
function updateArticle(params) {
    return http.post(prefix + '/updateArticle', qs.stringify(params))
}
export {
    getAllArticle, getArticle, getUserArticle,
    deleteArticle, updateArticle, publishArticle
}