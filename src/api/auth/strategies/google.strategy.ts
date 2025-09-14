import { GlobalConfig } from '@/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService<GlobalConfig>,
    private authService: AuthService,
  ) {
    const clientID = configService.getOrThrow('auth.googleClientId', {
      infer: true,
    });
    const clientSecret = configService.getOrThrow('auth.googleClientSecret', {
      infer: true,
    });
    const callbackURL = configService.getOrThrow('auth.googleCallbackURL', {
      infer: true,
    });

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Google OAuth configuration is incomplete. Check your environment variables.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    });

    return user;
  }
}
