import { useAuth } from '~/config/AuthContext';
import { Loading } from '~/component/ui/Loading';
import { Navigate } from 'react-router-dom';
import config from '~/config/index';

export const ProtectedRoute = ({children, requireAuth = true, allowedRoles = []}) => {
    const { currentUser, loading, role } = useAuth();

    if(loading) return <Loading />;

    if(requireAuth && !currentUser) {
        return <Navigate to={config.routes.login} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to={config.routes.unauthorized || config.routes.home} replace />;
    }

    return children;

};