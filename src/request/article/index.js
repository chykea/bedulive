import http from '../../utils/request'
import qs from 'qs'
const prefix = '/article'

function getAllArticle(params) {
    return http.get(prefix + '/getAllArticle?' + "page=" + params)
}
function getArticle(params) {
    return http.get(prefix + '/getArticleDetail?' + "id=" + params)
}
function getUserArticle(params) {
    return http.get(prefix + '/getUserArticle?' + "page=" + params)
}
function deleteArticle(params) {
    return http.get(prefix + '/deleteArticle?' + "id=" + params)
}
export {
    getAllArticle, getArticle, getUserArticle, deleteArticle
}