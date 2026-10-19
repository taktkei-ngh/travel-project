import { RouterContent } from '~/routes/RouterContent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '~/component/Layout/MainLayout';
import 'font-awesome/css/font-awesome.min.css';
import NotFound from '~/pages/NotFound';
import { Fragment, useEffect } from 'react';
import ScrollToTop from '~/component/Animation/ScrollToTop';
import webConfig from '~/config/webConfig';
import config from '~/config';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '~/config/ProtecteRoute';

function App() {

        const { i18n } = useTranslation();

        useEffect(() => {
            document.title = webConfig.defaultTitle;
        }, []);

        const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        };

        return (
        <Router>
            <ScrollToTop />

            <Routes>
                {RouterContent.map((route, index) => {
                    const isAdminRoute = route.path.startsWith(config.routes.adminHome);
                    const isTourRoute = route.path.startsWith(config.routes.tourDetail) || route.path.startsWith(config.routes.booking) || route.path.startsWith(config.routes.profile);
                    const requireAuth = isTourRoute || isAdminRoute
                    const allowedRoles = isAdminRoute ? ['ADMIN'] : [];
                    const Layout = isAdminRoute ? Fragment : MainLayout;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <ProtectedRoute requireAuth={requireAuth} allowedRoles={allowedRoles}>
                                    <Layout>
                                        {route.element}
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    );
                })}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
export default App;
