import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    RawAxiosRequestHeaders
} from "axios";
import {net} from "./disposial";
import createSubscribtion = net.createSubscribtion;
import {appConfig} from "@config";

export interface HttpResponse<T> {
    data: T
}

const instance: AxiosInstance = axios.create({
    withCredentials: true,
    timeout: 10000,
});

const isHandlerEnabled = (config: AxiosRequestConfig = {}): boolean => {
    if (config.headers instanceof AxiosHeaders) {
        const headers = config.headers as AxiosHeaders
        if (headers.get("X-Api-Request") !== null) {
            return false
        }
    } else {
        const headers = config.headers as RawAxiosRequestHeaders
        if (headers["X-Api-Request"] !== null) {
            return false
        }
    }

    return process.env.NODE_ENV != "production"
};

const requestHandler = (request: InternalAxiosRequestConfig<unknown>) => {
    if (isHandlerEnabled(request)) {
        console.error("Request Interceptor", request);
    }
    return request;
};

const errorHandler = (error: AxiosError) => {
    if (isHandlerEnabled(error.config)) {
        console.error("Error Interceptor", error);
    }

    return Promise.reject({ ...error });
};

const successHandler = (response: AxiosResponse) => {
    if (isHandlerEnabled(response.config)) {
        console.error("Response Interceptor", response);
    }
    return response;
};

instance.interceptors.request.use(
    request => requestHandler(request),
);

instance.interceptors.response.use(
    response => successHandler(response),
    error => errorHandler(error)
);

export async function sendApiRequest<T = unknown, R = AxiosResponse<T>, D = T>(
    config: AxiosRequestConfig,
    mapper: (input: R) => D
): Promise<D> {
    return sendRequest(appConfig.baseClientUrl, config, mapper)
}

async function sendRequest<T = unknown, R = AxiosResponse<T>, D = unknown>(
    baseUrl: string,
    config: AxiosRequestConfig,
    mapper: (input: R) => D
): Promise<D>  {
    const sub = createSubscribtion()

    const response = instance.request<T, R>(
        {
            cancelToken: sub.token,
            method: "POST",
            baseURL: baseUrl,
            withCredentials: false,
            ...config
        }
    )

    return mapper(await response)
}

export default instance;
