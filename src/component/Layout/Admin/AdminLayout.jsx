import { useEffect } from 'react';
import { FloatButton } from 'antd';

export const AdminLayout = ({ children }) => {
    useEffect(() => {
        document.title = "Admin - Pacific Travel";
    }, []);

    return (
        <div className={"flex flex-col min-h-full"}>
            <FloatButton.BackTop />
            <main className={"flex-grow"}>
                {children}
            </main>
        </div>
    );
};