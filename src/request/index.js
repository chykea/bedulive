import { login, register, changePassword, changeInfo, getUserList, banUser, updateUser, unbanUser } from "./user";
import { getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom } from "./live";
import { getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle, addComment, deleteComment, searchArticle, lock, unlock } from './article'
import { shouldUpload, uploadFile, mergeFile } from './upload'
import { getAllSubscriptRoom, subscribeLiveRoom, quitSubscribe, getIsSubscribe } from './liveStudent'
export {
    login, register, changePassword, changeInfo, getUserList, banUser, updateUser, unbanUser,  // 更改个人信息
    getPushURL, getLiveList, getPlayerURL, setLiveInfo, getLiveRoom, // 直播
    getAllArticle, getArticle, getUserArticle, deleteArticle, updateArticle, publishArticle,// 文章 
    addComment, deleteComment, searchArticle, lock, unlock,

    shouldUpload, mergeFile, uploadFile,
    getAllSubscriptRoom, subscribeLiveRoom, quitSubscribe, getIsSubscribe
}