import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const LOGIN_URL = '/login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to={LOGIN_URL} replace />;
};

export default ProtectedRoute;
