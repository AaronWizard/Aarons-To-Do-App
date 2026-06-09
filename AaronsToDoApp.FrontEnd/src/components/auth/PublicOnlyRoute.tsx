import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const HOME_URL = '/';

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to={HOME_URL} replace /> : children;
};

export default PublicOnlyRoute;
