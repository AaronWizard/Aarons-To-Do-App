import { createContext, useState } from "react";
import { tokenStorage } from "../../api/api";
import { userService } from "../../services/user_service";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => !!tokenStorage.getAccessToken()
    );

    const login = async (email: string, password: string) => {
        await userService.login(email, password);
        setIsAuthenticated(true);
    }
    const logout = async () => {
        await userService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
