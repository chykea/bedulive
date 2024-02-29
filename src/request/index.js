import { login, register, changePassword, changeInfo } from "./user";
import { getPushURL, getLiveList, getPlayerURL, setLiveInfo } from "./live";

export {
    login, register, // 登录注册 
    changePassword, changeInfo, // 更改个人信息
    getPushURL, getLiveList, getPlayerURL, setLiveInfo // 直播
}