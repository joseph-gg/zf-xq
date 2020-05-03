// 全局公共方法
// 返回promise 外边调用者可以通过async await获取resolve的数据
// 城市信息存储到本地 localStorage
import {getCityInfo} from "./api/city";
export const CURR_CITY = 'curr_city', ZFW_USER = 'ZFE_USER';

export const getLocalData = (key) => {
    return window.localStorage.getItem(key)
}
export const setLocalData = (key, val) => {
    window.localStorage.setItem(key, val)
}
export const removeLocalData = (key) => {
    window.localStorage.removeItem(key)
}
// 持久化token
export function setToken(token) {
    setLocalData(ZFW_USER, token)
}
// 删除token
export function delToken() {
    removeLocalData(ZFW_USER)
}
// 获取token
export function getToken() {
    return getLocalData(ZFW_USER)
}
// 是否登录
const Auth = () => !!getToken();
// 根据百度地图API获取定位城市名字
const getCityName = async () => {
    return new Promise((resolve, reject) => {
        let myCity = new window.BMap.localCity();
        myCity.get((res) => {
            resolve(res.name)
        })
    })
}
export function getCurrCity() {
    const currCity = JSON.parse(getLocalData(CURR_CITY));
    if (!currCity) {
        return new Promise(resolve => {
            const myCity = new window.BMap.LocalCity();
            myCity.get(async result => {
                const { status, data } = await getCityInfo(result.name);
                if (status ===200) {
                    // 存储本地
                    setLocalData(CURR_CITY, JSON.stringify(data))
                    // 传递数据
                    resolve(data)
                }
            })
        })
    } else {
        return Promise.resolve(currCity)
    }
}
export {Auth};
