import { Navigate } from 'react-router-dom';
import { Loading } from '~/component/ui/Loading';
import { useAuth } from './AuthContext';
import config from './index';

function InterceptRoute({children ,route}) {
    const { currentUser, loading } = useAuth();

    if (loading) return <Loading />;

    if (!currentUser && !loading && route) {
        return <Navigate to={config.routes.login} />;
    }

    return children;
}

export default InterceptRoute;