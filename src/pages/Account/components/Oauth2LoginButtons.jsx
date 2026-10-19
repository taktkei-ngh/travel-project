import { message } from 'antd';
// import { GoogleLogin } from '@react-oauth/google';

export const Oauth2LoginButtons = () => {

    const handleGoogleLoginSuccess = (resp) => {
        message.success('Success',1);
    }
    const handleFacebookLoginSuccess = (resp) => {
        message.success('Success',1);
    }

    const handleGoogleLoginFailure = (resp) => {
        message.error('Failure',1);
    }
    const handleFacebookLoginFailure = (resp) => {
        message.error('Failure',1);
    }
    return (
        <>
            {/*<GoogleLogin onSuccess={handleGoogleLoginSuccess}*/}
            {/*                onFailure={handleGoogleLoginFailure}/>*/}

        </>
    );
};