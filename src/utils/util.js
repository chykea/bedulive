

const getToken = () => {
    const token = sessionStorage.getItem('token');
    return token ? token : null;
}
const getInfo = () => {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

export {
    getToken,
    getInfo,
}