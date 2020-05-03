import axios from 'axios'
import {Toast} from "antd-mobile";
const BASE_URL = 'http://api-haoke-dev.itheima.net';
const myAxios = axios.create({
    baseURL: BASE_URL,
})
// 拦截器
// 注册拦截器（request和response）
// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    // Do something before request is sent
    Toast.loading('加载中...',0)
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    Toast.hide();
    const _res = {
        status: response.data.status,
        description: response.data.description,
        data: response.data.body
    }
    return _res;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
export default myAxios;
export {BASE_URL}
