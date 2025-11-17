import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GoogleProfile } from 'src/common/interface/google.interface';
import { LoginType } from '../dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
      passReqToCallback: true,
      state: true, // Enable state parameter to pass metadata
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    // Here you can grab the decoded state if you want
    try {
      const state = req.query.state;
      console.log('State parameter:', state);

      let metadata: any = state;
      metadata = JSON.parse(atob(state));
      console.log('Decoded state metadata:', metadata);

      const user = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        picture: profile.photos?.[0]?.value,
        state: metadata, // Include parsed metadata
      };
      console.log('Google user profile:', user);
      done(null, user);
    } catch (error) {
      console.error('Google strategy error:', error);
      done(error, false);
    }
  }
}
