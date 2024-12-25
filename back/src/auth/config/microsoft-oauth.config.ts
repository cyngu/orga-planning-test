import { registerAs } from '@nestjs/config';

export default registerAs('microsoftOAuth', () => ({
  clientId: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
  tenant: 'a54665a0-aecb-45e3-800f-0356c0749660',
}));
