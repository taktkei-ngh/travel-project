/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            animation: {
                'unique-gradient': 'gradient-wave 8s ease infinite',
                ripple: 'ripple 0.4s ease-out',
                'check': 'checkBounce 0.4s ease-in-out',
                'x': 'xShake 0.3s ease-in-out',
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'arrow-down': 'arrowDown 1s infinite',
            },
            keyframes: {
                'gradient-wave': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '25%': { backgroundPosition: '50% 100%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '75%': { backgroundPosition: '50% 0%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                arrowDown: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '50%': { transform: 'translateY(8px)', opacity: '0.5' },
                    '100%': { transform: 'translateY(16px)', opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(5px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                ripple: {
                    '0%': { transform: 'scale(0)', opacity: '0.5' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                },
                checkBounce: {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '50%': { transform: 'scale(1.2)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                xShake: {
                    '0%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-3px)' },
                    '50%': { transform: 'translateX(3px)' },
                    '75%': { transform: 'translateX(-3px)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

