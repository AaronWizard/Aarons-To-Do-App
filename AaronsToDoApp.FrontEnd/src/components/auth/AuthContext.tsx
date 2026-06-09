import { createContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user_service";
import { Box, CircularProgress } from "@mui/material";

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
            await userService.refreshAccess();
            return await userService.getCurrentUserInfo();
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
