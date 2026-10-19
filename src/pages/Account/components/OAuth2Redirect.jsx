import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loading } from '~/component/ui/Loading';

export const OAuth2Redirect = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const accessToken = urlParams.get('access_token');
		const refreshToken = urlParams.get('refresh_token');
		const error = urlParams.get('error');

		if (error) {
			if (window.opener) {
				window.opener.postMessage({ error: 'auth_failed' }, window.location.origin);
				window.close();
			} else {
				navigate('/login?error=auth_failed');
			}
			return;
		}

		if (accessToken) {
			if (window.opener) {
				window.opener.postMessage({ accessToken, refreshToken }, window.location.origin);
				window.close();
			} else {
				navigate('/');
			}
		} else {
			navigate('/login?error=auth_failed');
		}

	}, [navigate]);

	return (
		<Loading></Loading>
	);
};

