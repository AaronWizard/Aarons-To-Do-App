import { createContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user_service";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ApiError } from "../../utils/errors";
import { isAxiosError } from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    currentUserEmail: () => string | null;
}

interface LoginParams {
    email: string;
    password: string;
}

const CURRENT_USER_QUERY_KEY = 'currentUser';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading, isError } = useQuery({
        queryKey: [CURRENT_USER_QUERY_KEY],
        queryFn: async () => {
            try {
                await userService.refreshAccess();
                return await userService.getCurrentUserInfo();
            }
            catch (error: unknown) {
                if (
                    (error instanceof ApiError)
                    && (
                        error.networkError
                        || (
                            error.status && (error.status >= 500)
                        )
                    )
                ) {
                    throw error;
                }
                else if (
                    isAxiosError(error)
                    && (
                        (
                            (
                                !error.response
                                || (error.code === 'ERR_NETWORK')
                            )
                        ) || (
                            error.response
                            && (error.response.status >= 500)
                        )
                    )
                ) {
                    throw error;
                }

                return null;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const loginMutation = useMutation({
        mutationFn: (loginParams: LoginParams) =>
            userService.login(loginParams.email, loginParams.password),
        onSuccess: () => queryClient.invalidateQueries(
            { queryKey: [CURRENT_USER_QUERY_KEY] }
        )
    });
    const logoutMutation = useMutation({
        mutationFn: userService.logout,
        onSuccess: () => {
            queryClient.setQueryData([CURRENT_USER_QUERY_KEY], null);
            queryClient.clear();
        }
    });

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
    }
    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    const isAuthenticated = !!currentUser && !isError;
    const currentUserEmail = () => currentUser?.email ?? null;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }
    else if (isError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>
                    Page unavailable. Please try again later.
                </Typography>
            </Box>
        )
    }
    else {
        return (
            <AuthContext.Provider value={{
                isAuthenticated, isLoading, login, logout, currentUserEmail
            }}>
                {children}
            </AuthContext.Provider>
        );
    }
};

export { AuthContext };
