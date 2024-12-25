/** @type {import('next').NextConfig} */
import idealysConfig from './config.json' assert { type: 'json' };


const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: idealysConfig.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_API_KEY: idealysConfig.NEXT_PUBLIC_API_KEY,
        NEXT_PUBLIC_JWT_PUBLIC_KEY: idealysConfig.NEXT_PUBLIC_JWT_PUBLIC_KEY,
        NEXT_PUBLIC_SUPER_ADMIN_ID: idealysConfig.NEXT_PUBLIC_SUPER_ADMIN_ID,
        NEXT_PUBLIC_ADMIN_ID: idealysConfig.NEXT_PUBLIC_ADMIN_ID,
        NEXT_PUBLIC_API_URL_SSO: idealysConfig.NEXT_PUBLIC_API_URL_SSO,
        NEXT_PUBLIC_ENTREPRISE_ID: idealysConfig.NEXT_PUBLIC_ENTREPRISE_ID
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })

        return config;
    },
};

export default nextConfig;
