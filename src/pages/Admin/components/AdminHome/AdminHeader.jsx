import { Header } from 'antd/es/layout/layout';

export const AdminHeader = ({children, theme}) => (
    <Header className={`bg-${theme} text-white flex items-center justify-between px-4`}>
        {children}
    </Header>
);
