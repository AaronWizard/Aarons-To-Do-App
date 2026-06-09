import { createContext, useState } from "react";
import { tokenStorage } from "../../api/api";
import { userService } from "../../services/user_service";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    currentUserEmail: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => !!tokenStorage.getAccessToken()
    );
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        await userService.login(email, password);
        setIsAuthenticated(true);
        setUserEmail(email);
    }
    const logout = async () => {
        await userService.logout();
        setIsAuthenticated(false);
        setUserEmail(null);
    };

    const currentUserEmail = () => userEmail;

    return (
        <AuthContext.Provider value={{
            isAuthenticated, login, logout, currentUserEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
