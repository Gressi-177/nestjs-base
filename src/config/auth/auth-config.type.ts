export type AuthConfig = {
  jwtSecret: string;
  jwtExpirationTime: string;
  jwtRefreshExpirationTime: string;
  basicAuth: {
    username: string;
    password: string;
  };
  oAuth: {
    github: {
      clientId?: string;
      clientSecret?: string;
    };
  };
};
