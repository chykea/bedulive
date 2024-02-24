

const getToken = () => {
    const token = sessionStorage.getItem('token');
    return token ? token : null;
}
const getInfo = () => {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}
const debounce = (func, wait = 750, immediate) => {

    let timeout;

    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout); // timeout 不为null
        if (immediate) {
            let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(function () {
                timeout = null;
            }, wait)
            if (callNow) {
                func.apply(context, args)
            }
        }
        else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
    }
}
export {
    getToken,
    getInfo,
    debounce
}