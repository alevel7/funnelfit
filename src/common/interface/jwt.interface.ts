import { UserRole } from '../enums/user.enum';

export interface LoggedInUser {
  email: string;
  id: string;
  role: UserRole;
}
