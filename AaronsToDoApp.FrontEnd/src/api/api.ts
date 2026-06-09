import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { AccessTokenDto } from "./types";
import { rejectAPIError } from "../utils/errors";

let accessToken: string | null = null;
/** Set the access token. */
export const setAccessToken = (token: string | null) => { accessToken = token };
/** Get the current access. token */
export const getAccessToken = (): string | null => accessToken;

// The API client

const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT_MS = import.meta.env.VITE_API_TIMEOUT_MS;

/** The app's main API client. */
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: TIMEOUT_MS,
    withCredentials: true
});

const bearerAuthorization = (token: string) => `Bearer ${token}`;

// Intercept requests to attach access token
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = bearerAuthorization(token);
        }
        return config;
    }
);

// Try to refresh tokens if API call returns 401 Unauthorized.
// Handle multiple requests using strategy from
// https://hoseindoran.medium.com/efficient-axios-authentication-preventing-multiple-requests-during-token-refresh-400e9247ab29

let isRefreshing = false;
// Failed requests to retry when we have new tokens.
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
    error: AxiosError | null,
    token: string | null = null
) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const STATUS_UNAUTHORIZED = 401;
const METHOD_REFRESH = 'users/refresh-access';

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            return rejectAPIError(error); // Network error
        }

        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean,
            _skipAuthRefresh?: boolean;
        };

        if ((error.response?.status === STATUS_UNAUTHORIZED)
            && originalRequest && !originalRequest._retry
            && !originalRequest._skipAuthRefresh) {
            if (isRefreshing) {
                // Queue response
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (originalRequest.headers
                        && (typeof token === 'string')) {
                        originalRequest.headers.Authorization
                            = bearerAuthorization(token);
                    }
                    return apiClient(originalRequest);
                }).catch(error => rejectAPIError(error));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint directly with axios to avoid
                // interceptor loops
                const response = await axios.post<AccessTokenDto>(
                    `${API_URL}/${METHOD_REFRESH}`,
                    {},
                    { withCredentials: true }
                );
                const accessToken = response.data.accessToken;
                setAccessToken(response.data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization
                        = bearerAuthorization(accessToken);
                }
                processQueue(null, accessToken);
                return apiClient(originalRequest);
            }
            catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
                setAccessToken(null);
                return rejectAPIError(refreshError);
            }
            finally {
                isRefreshing = false;
            }
        }
        else {
            return rejectAPIError(error);
        }
    }
);

/**
 * Include this in the parameters to a call on `apiClient` to have it skip token
 * refreshing.
 */
export const apiSkipAuthRefresh:
    AxiosRequestConfig & { _skipAuthRefresh?: boolean } = {
    _skipAuthRefresh: true
};
