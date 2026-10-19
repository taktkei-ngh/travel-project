import { Button, Divider, Form, Input, message } from 'antd';
import { DiscordFilled, EyeInvisibleOutlined, EyeTwoTone, FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import config from '~/config';
import AuthService from '~/services/AuthServices';
import Iridescence from '~/component/Animation/AnimatedUI/Background/Iridescence';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/config/AuthContext';

export const Register = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isSignIn, setIsSignIn] = useState(false);
	const { t } = useTranslation();

	const { handleOAuthLogin } = useAuth();

	const handleRegister = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			message.error(t('register.ti1'), 1);
			return;
		}
		if (!email || !firstName || !lastName || !password || !confirmPassword) {
			message.error(t('register.ti2'), 1);
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			message.error('Email không hợp lệ');
		}
		setLoading(true);

		const body = {
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
			email: email,
		};

		try {
			await AuthService.register(body);
			message.success(t('register.ti3'), 1);
			navigate(config.routes.login);
		} catch (error) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async (e) => {
		e.preventDefault();
		if (!isSignIn) {
			setIsSignIn(true);
			await AuthService.loginGoogle().then(() => {
				navigate('/');
				message.success(t('register.ti5'), 2);
			}).catch(() => {
				message.error(t('register.ti6'), 5);
			});
		}
	};

	const handleFacebookLogin = async (e) => {
		e.preventDefault();
		if (!isSignIn) {

		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Iridescence
				color={[1, 1, 1]}
				mouseReact={false}
				amplitude={0.1}
				speed={1.0}
				className="absolute inset-0 py-12 z-0"
			/>
			<div className="bg-white relative p-8 rounded-lg shadow-lg w-full uppercase max-w-2xl">
				<h2 className="text-2xl font-bold text-center mb-6 text-orange-400">{t('register.ti7')}</h2>
				<Divider />
				<Form className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium">{t('register.ti8')}<span
							className={'text-red-500'}>*</span></label>
						<Input placeholder={t('register.ti8')} onChange={(e) => setLastName(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm font-medium">{t('register.ti9')}<span
							className={'text-red-500'}>*</span></label>
						<Input placeholder={t('register.ti9')} onChange={(e) => setFirstName(e.target.value)} />
					</div>
					<div className={'col-span-2'}>
						<label className={'block text-sm font-medium'}>{t('register.ti10')}<span
							className={'text-red-500'}>*</span></label>
						<Input placeholder={t('register.ti10')} onChange={(e) => setUsername(e.target.value)} />
					</div>
					<div className="col-span-2">
						<label className="block text-sm font-medium">Email<span
							className={'text-red-500'}>*</span></label>
						<Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm font-medium">{t('register.ti11')}<span
							className={'text-red-500'}>*</span></label>
						<Input.Password
							placeholder={t('register.ti11')}
							iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">{t('register.ti12')}<span
							className={'text-red-500'}>*</span></label>
						<Input.Password
							placeholder={t('register.ti12')}
							iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<p className="col-span-2 text-sm text-red-500"><span
						className={'text-red-500'}>(*)</span> {t('register.ti13')}</p>
					<div className="col-span-2 justify-center w-1/2 mx-auto">
						<button
							onClick={handleRegister}
							className="w-full bg-orange-400 transition-all hover:bg-orange-700 hover:shadow-lg font-bold text-white py-2 rounded-md"
						>
							{loading ? t('register.ti14') : t('register.ti15')}
						</button>
					</div>
				</Form>
				<div className={'text-center mt-4'}>
					<p className="text-gray-600">{t('register.ti16')}{' '}
						<Link to={config.routes.login} className="text-orange-600 hover:text-orange-500 font-semibold">
							{t('register.ti17')}
						</Link>
					</p>
				</div>
				<Divider plain children={t('register.ti18')} />
				<div className="flex justify-around">
					<Button
						onClick={() => handleOAuthLogin('google', navigate)}
						color={'danger'}
						variant={'solid'}
						size={'large'}
						icon={<GoogleOutlined />}
					>
						{t('register.ti19')}
					</Button>
					<Button
						onClick={() => handleOAuthLogin('discord', navigate)}
						color={'primary'}
						variant={'solid'}
						size={'large'}
						icon={<DiscordFilled />}
					>
						{t('register.ti20')}
					</Button>
				</div>
			</div>
		</div>
	);
};
