import { apiClient, tokenStorage } from "../api/api";
import type {
    AuthTokensDto,
    LoginDto,
    PasswordRequirementsDto,
    RefreshTokenDto,
    RegisterDto
} from "../api/types";

const METHOD_LOGIN = 'users/login';
const METHOD_REVOKE_REFRESH = 'users/revoke-refresh-token';
const METHOD_PASSWORD_REQUIREMENTS = 'users/password-requirements';
const METHOD_REGISTER = 'users/register';

class UserService {
    async login(email: string, password: string) {
        const { data } = await apiClient.post<AuthTokensDto>(
            METHOD_LOGIN,
            { email: email, password: password } as LoginDto
        );
        tokenStorage.setTokens(data);
    }

    async logout() {
        try {
            const refreshToken = tokenStorage.getRefreshToken();
            if (refreshToken) {
                await apiClient.post(
                    METHOD_REVOKE_REFRESH,
                    { refreshToken: refreshToken } as RefreshTokenDto
                )
            }
        }
        finally {
            tokenStorage.clearTokens();
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
