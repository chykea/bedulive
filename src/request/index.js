import { login, register, changePassword, changeInfo } from "./user";
import { getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom } from "./live";
import { getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle, addComment } from './article'

export {
    login, register, // 登录注册 
    changePassword, changeInfo, // 更改个人信息
    getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom, // 直播
    getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle,// 文章 
    addComment

}