import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirmPassword === object.password;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Password and confirmPassword do not match';
  }
}

export class PasswordResetDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @Validate(MatchPasswordConstraint)
  confirmPassword: string;
}
