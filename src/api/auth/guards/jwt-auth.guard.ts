import { IS_PUBLIC_AUTH } from '@/constants/auth.constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAuthPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_AUTH,
      [context.getHandler(), context.getClass()],
    );

    if (isAuthPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
