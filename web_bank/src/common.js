import 'whatwg-fetch';
import { notification, message } from 'antd';

var path = require('path');

// 获取节点配置信息
var nodeConf = require(path.join(__dirname, '../config/nodeconf.json'));
const serverBackEnd = "http://" + nodeConf["BackEnd"].IP + ":" + nodeConf["BackEnd"].Port.toString();
export const clientIP = "http://" + nodeConf["Bank"].IP + ":" + nodeConf["Bank"].Port.toString();
const serverCA = "http://" + nodeConf["CA"].IP + ":" + nodeConf["CA"].Port.toString();

// 向BackEnd发送get请求
export function fetch_get(url) {
    return fetch(serverBackEnd + url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    }).then((response) => checkStatus(response));
}

// 向BackEnd发送post请求
export function fetch_post(url, values) {
    return fetch(serverBackEnd + url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(values),
    }).then((response) => checkStatus(response));
}

// 向CA发送post请求
export function fetch_ca_post(url, values) {
    return fetch(serverCA + url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(values),
    }).then((response) => checkStatus(response));
}

// 检查返回结果
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
