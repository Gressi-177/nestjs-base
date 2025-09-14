export type AuthConfig = {
  jwtSecret: string;
  jwtExpirationTime: string;
  jwtRefreshExpirationTime: string;

  googleClientId: string;
  googleClientSecret: string;
  googleCallbackURL: string;
};
