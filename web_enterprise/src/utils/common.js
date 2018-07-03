import fetch from 'dva/fetch';
import { notification, message } from 'antd';

export const clientIP = "http://39.104.175.115:8000"
export const serverIP = "http://39.104.175.115:8080"

export function fetch_get(url){
    return fetch(serverIP + url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    })
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
    })
}

function checkStatus(response){
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else if (response.status === 401) {
        window.location.href = clientIP + "/#/user/login";
    }
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
    });
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function request(url, options){
    const defaultOptions = {
        credentials: "include",
        mode: "cors",
    }, newOptions = {...options, ...defaultOptions};
    if(newOptions.method === "POST" || newOptions.method === "PUT"){
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
    }

    return fetch(serverIP + url, newOptions)
        .then(checkStatus)
        .then(response => response.json())
        .catch((error) => {
            if(error.code){
                notification.error({
                    message: error.name,
                    description: error.description,
                });
            }
            if("stack" in error && "message" in error){
                notification.error({
                    message: `请求错误 ${serverIP + url}`,
                    description: error.message,
                });
            }
            throw error;
        });
}

export function getFileUploadOptions(onChange, onRemove){
    const options = {
        name: 'file',
        action: serverIP + '/api/Document/Upload',
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
                onChange(info);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        onRemove(file) {
            //console.log(file);
            if(onRemove){
                onRemove(info);
            }
        }
    };
    return options;
}
