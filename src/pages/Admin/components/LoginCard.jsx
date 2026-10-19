import { useState } from 'react';

const LoginCard = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h3 className="text-center text-xl font-semibold">Đăng nhập vào hệ thống</h3>
            <form onSubmit={onSubmit}>
                <div className="mt-4">
                    <label className="block">Tên người dùng</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-4">
                    <label className="block">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginCard;