import {
    apiClient,
    apiSkipAuthRefresh,
    refreshAPIAccess,
    setAPIAccessToken
} from "../api/api";
import type {
    AccessTokenDto,
    LoginDto,
    PasswordRequirementsDto,
    RegisterDto,
    UserInfoDto
} from "../api/types";

const METHOD_LOGIN = 'users/login';
const METHOD_REVOKE_REFRESH = 'users/revoke-refresh-token';
const METHOD_PASSWORD_REQUIREMENTS = 'users/password-requirements';
const METHOD_REGISTER = 'users/register';
const METHOD_CURRENT_USER_INFO = 'users/current-user';

class UserService {
    async login(email: string, password: string) {
        const { data } = await apiClient.post<AccessTokenDto>(
            METHOD_LOGIN,
            { email: email, password: password } as LoginDto,
            apiSkipAuthRefresh
        );
        setAPIAccessToken(data.accessToken);
    }

    async refreshAccess(): Promise<string> {
        const token = await refreshAPIAccess();
        setAPIAccessToken(token);
        return token;
    }

    async logout() {
        try {
            await apiClient.post(METHOD_REVOKE_REFRESH)
        }
        finally {
            setAPIAccessToken(null);
        }
    }

    async passwordRequirements(): Promise<PasswordRequirementsDto | undefined> {
        const { data } = await apiClient.get<PasswordRequirementsDto>(
            METHOD_PASSWORD_REQUIREMENTS
        );
        return data;
    }

    async register(email: string, password: string) {
        await apiClient.post(
            METHOD_REGISTER,
            { email: email, password: password } as RegisterDto
        );
    }

    async getCurrentUserInfo(): Promise<UserInfoDto> {
        const response = await apiClient.get<UserInfoDto>(
            METHOD_CURRENT_USER_INFO,
        );
        return response.data;
    }
}
export const userService = new UserService();
