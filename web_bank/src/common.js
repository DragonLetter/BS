import 'whatwg-fetch';
import { notification, message } from 'antd';

var path = require('path');

// 获取节点配置信息
var nodeConf = require(path.join(__dirname, '../config/nodeconf.json'));
const serverIP = "http://" + nodeConf["BackEnd"].IP + ":" + nodeConf["BackEnd"].Port.toString();
export const clientIP = "http://" + nodeConf["Bank"].IP + ":" + nodeConf["Bank"].Port.toString();
//const serverIP = "http://127.0.0.1:8080";
//export const clientIP = "http://127.0.0.1:9000";

export function fetch_get(url) {
    return fetch(serverIP + url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    }).then((response) => checkStatus(response));
}

export function fetch_post(url, values) {
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

export function fetch_ca_post(url, values) {
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

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else if (response.status === 401) {
        window.location.href = clientIP + "/#/";
        return;
    } else if (response.status === 405) {
        return response;
    }
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
    });
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
