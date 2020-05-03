import api from '../../axios'
import {getToken} from "../../index";
export function login(data) {
    return api.post('/user/login',data)
}
// 登录人信息
export function getUserData() {
    return api.get('/user',{
        headers:{
            authorization: getToken()
        }
    })
}
// 退出
export function logout() {
    return api.post('/user/logout',null, {
        headers:{
            authorization: getToken()
        }
    })
}
