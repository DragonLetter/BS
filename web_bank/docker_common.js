import 'whatwg-fetch'
import { notification, message } from 'antd';
const serverIP = "http://39.104.175.115:8080"
export const clientIP = "http://39.104.175.115:9000"
const serverCA = "http://39.104.64.103:7054"

export function fetch_get(url){
    return fetch(serverIP + url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    }).then((response) => checkStatus(response));
}

export function fetch_post(url, values){
    return fetch(serverIP + url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(values),
    }).then((response) => checkStatus(response));
}
export function fetch_ca_post(url, values){
    return fetch(serverCA + url, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(values),
    }).then((response) => function(response){ return response;});
}
function checkStatus(response){
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else if (response.status === 401) {
        window.location.href = clientIP + "/#/";
        return;
    }
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
    });
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
