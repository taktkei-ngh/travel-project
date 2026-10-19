import { useAuth } from '~/config/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loading } from '~/component/ui/Loading';
import config from '~/config';

function PrivateRoute({ children, adminOnly = false }) {
    const { currentUser, loading, role } = useAuth();

    if (loading) return <Loading />;

    if (adminOnly && (!currentUser || role !== 'ADMIN')) {
        return <Navigate to={config.routes.home} />;
    }

    return children;
}

export default PrivateRoute;
