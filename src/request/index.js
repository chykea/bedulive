import { login, register, changePassword, changeInfo, uploadAvatar } from "./user";
import { getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom } from "./live";
import { getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle, addComment, deleteComment, searchArticle } from './article'

export {
    login, register, // 登录注册 
    changePassword, changeInfo, uploadAvatar, // 更改个人信息
    getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom, // 直播
    getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle,// 文章 
    addComment, deleteComment, searchArticle
}