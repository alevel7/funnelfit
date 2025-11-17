import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticationGuard } from './auth.guard';
import { UserRole } from 'src/common/enums/user.enum';

@Injectable()
export class SMEGuard extends AuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run the base authentication guard
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== UserRole.SME) {
      throw new ForbiddenException(
        'Authorization error: Only SMEs are allowed',
      );
    }
    return true;
  }
}
