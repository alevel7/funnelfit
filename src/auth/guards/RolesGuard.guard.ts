import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationGuard } from './auth.guard';
import { UserRole } from 'src/common/enums/user.enum';

@Injectable()
export class RolesGuard extends AuthenticationGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // First, run the base authentication guard
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) return false;

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasRole = requiredRoles.some((role) => user?.role === role);

        if (!hasRole) {
            throw new ForbiddenException(`Authorization error: Only ${requiredRoles.join(', ')} are allowed`);
        }

        return hasRole;
    }
}