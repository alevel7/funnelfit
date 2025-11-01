import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);