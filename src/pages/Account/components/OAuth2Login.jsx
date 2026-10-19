import { Loading } from '~/component/ui/Loading';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AuthService from '~/services/AuthServices';

export const OAuth2Login = () => {
	const { provider } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const isProcessedRef = useRef(false); // Use ref to persist across renders

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const error = urlParams.get('error');
		const code = urlParams.get('code');

		if (error) {
			navigate('/login?error=auth_failed', { replace: true });
			return;
		}

		if (code && !isProcessedRef.current) {
			isProcessedRef.current = true;
			console.log(`Processing OAuth callback: provider=${provider}, code=${code}`);
			
			// Redirect to backend callback URL
			const callbackUrl = AuthService.getOAuthCallbackUrl(provider, code);
			window.location.href = callbackUrl;
		}
	}, [navigate, provider, location.search]);

	return <Loading />;
};