import { login, register, changePassword, changeInfo, getUserList, banUser, updateUser, unbanUser } from "./user";
import { getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom } from "./live";
import { getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle, addComment, deleteComment, searchArticle, lock, unlock } from './article'
import { shouldUpload, uploadFile, mergeFile } from './upload'
import { getAllSubscriptRoom, subscribeLiveRoom, quitSubscribe, getIsSubscribe } from './liveStudent'
import { getUserIsSubscribe, getUserSubscribeList, subscribeUser, cancelSubscribeUser } from './userSubscribe'
export {
    login, register, changePassword, changeInfo, getUserList, banUser, updateUser, unbanUser,  // 更改个人信息
    getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom, // 直播
    getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle,// 文章 
    addComment, deleteComment, searchArticle, lock, unlock,

    shouldUpload, mergeFile, uploadFile, // 文件上传
    getAllSubscriptRoom, subscribeLiveRoom, quitSubscribe, getIsSubscribe, // 直播间订阅与查询
    getUserSubscribeList, getUserIsSubscribe, subscribeUser, cancelSubscribeUser // 用户关注
}