import { login, register, changePassword, changeInfo } from "./user";
import { getPushURL, getLiveList, getPlayerURL } from "./live";

export {
    login, register, // 登录注册 
    changePassword, changeInfo, // 更改个人信息
    getPushURL, getLiveList, getPlayerURL // 直播
}