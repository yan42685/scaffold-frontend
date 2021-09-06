import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import qs from "qs";
import { ExceptionEnum, Result, TokenDto } from "@/api/rest-api";
import { message } from "ant-design-vue";
import { messenger } from "./my-ant-design-vue";
// axios重试插件
import * as rax from "retry-axios";
import { loginRedirect } from "./timeout-actions";
import {
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
    saveRefreshToken,
} from "./cookies";

// 直接调用Axios可以处理多个请求, Axios.all([request1, ...]).then(() => Axios.spread(result1, ...) => {})

// ============= 请求重试模块 ============
// 请求超时的时限
const REQUEST_TIMEOUT = 1000 * 13;

// create an axios instance
const httpClient = axios.create({
    // npm run serve 默认指向.env.development
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true, // send cookies when cross-domain requests
    headers: {
        accessToken: getAccessToken(),
    },
    timeout: REQUEST_TIMEOUT, // request timeout
    raxConfig: {
        // 重试次数
        retry: 3,
        onRetryAttempt: (err) => {
            messenger.warning(`请求超时，正在重试`);
        },
    },
});
// 绑定实例 详见: https://github.com/JustinBeckwith/retry-axios/issues/121
httpClient.defaults.raxConfig = {
    ...httpClient.defaults.raxConfig,
    instance: httpClient,
};

// 使重试插件生效
const interceptorId = rax.attach(httpClient);

// ============= 对外提供的api ============
export function getRequest<T>(url: string, params?: any): Promise<Result<T>> {
    return httpClient.get(url, { params: params });
}

export function postRequest<T>(url: string, params?: any): Promise<Result<T>> {
    return httpClient.post(url, qs.stringify(params));
}

export function putRequest<T>(url: string, params?: any): Promise<Result<T>> {
    return httpClient.put(url, qs.stringify(params));
}

export function deleteRequest<T>(
    url: string,
    params?: any
): Promise<Result<T>> {
    return httpClient.delete(url, { params: params });
}

export function patchRequest<T>(url: string, params?: any): Promise<Result<T>> {
    return httpClient.patch(url, qs.stringify(params));
}

// ============= 请求拦截器模块 ============
httpClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },

    (error) => {
        message.error(error);
        return Promise.reject(error);
    }
);

// ============= 响应拦截器模块 ============
// 是否正在刷新token
let isRefreshingToken = false;
// 正在刷新token时, 其他请求进入等待队列
let pendingRequests: { (newAccessToken: string): void }[] = [];

// response interceptor
httpClient.interceptors.response.use(
    // HTTP状态码为200时才经过这段代码
    (response: AxiosResponse) => {
        // handleError(response);

        const config = response.config;
        const result: Result<unknown> = response.data;

        const errorCode: number = result.code;
        const errorMessage: string = result.message;
        switch (errorCode) {
            case (ExceptionEnum.NOT_LOGIN, ExceptionEnum.WRONG_TOKEN):
                // 如果未登录或者token错误，就重新登录
                loginRedirect();
                break;
            case ExceptionEnum.TOKEN_EXPIRED:
                // accessToken过期, 尝试刷新token
                if (!isRefreshingToken) {
                    isRefreshingToken = true;
                    postRequest(
                        "/api/account/refreshToken",
                        getRefreshToken()
                    ).then((result) => {
                        // 如果刷新token也失败，只能重新登录了
                        if (result.code !== 0) {
                            loginRedirect();
                            isRefreshingToken = false;
                            pendingRequests = [];
                            return;
                        }

                        const {
                            accessToken,
                            refreshToken,
                        } = result.data as TokenDto;
                        saveAccessToken(accessToken);
                        saveRefreshToken(refreshToken);
                        // 已经保存了新的accessToken, 其他请求可以正常发送了
                        isRefreshingToken = false;
                        // 修改这次请求的 accessToken
                        config.headers["accessToken"] = accessToken;

                        // 发送等待队列中的所有请求
                        pendingRequests.forEach((sendRequest) =>
                            sendRequest(accessToken)
                        );
                        // 清空等待队列
                        pendingRequests = [];
                        // 立刻重新发送这次请求
                        return httpClient(config);
                    });
                } else {
                    // 如果正在刷新token, 将 [因accessToken过期而调用失败的请求] 重新加入等待队列
                    return new Promise((resolve) => {
                        pendingRequests.push((newAccessToken: string) => {
                            config.headers["accessToken"] = newAccessToken;
                            resolve(httpClient(config));
                        });
                    });
                }
                break;

            default:
                // 不需要统一处理的errorCode部分
                break;
        }
        return response.data;
    },

    (error) => {
        // 异常处理

        // 可以进行相关提示等处理
        return Promise.reject(error);
    }
);
