import { apiClient, apiSkipAuthRefresh, setAccessToken } from "../api/api";
import type {
    AccessTokenDto,
    LoginDto,
    PasswordRequirementsDto,
    RegisterDto
} from "../api/types";

const METHOD_LOGIN = 'users/login';
const METHOD_REVOKE_REFRESH = 'users/revoke-refresh-token';
const METHOD_PASSWORD_REQUIREMENTS = 'users/password-requirements';
const METHOD_REGISTER = 'users/register';

class UserService {
    async login(email: string, password: string) {
        const { data } = await apiClient.post<AccessTokenDto>(
            METHOD_LOGIN,
            { email: email, password: password } as LoginDto,
            apiSkipAuthRefresh
        );
        setAccessToken(data.accessToken);
    }

    async logout() {
        try {
            await apiClient.post(METHOD_REVOKE_REFRESH)
        }
        finally {
            setAccessToken(null);
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
}
export const userService = new UserService();
