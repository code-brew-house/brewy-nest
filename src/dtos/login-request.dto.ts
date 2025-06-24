import {
  IsString,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'usernameOrEmail', async: false })
class UsernameOrEmailConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.username || obj.email);
  }
  defaultMessage() {
    return 'Either username or email must be provided';
  }
}

export class LoginRequestDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  password: string;

  @Validate(UsernameOrEmailConstraint)
  _usernameOrEmail: string;
}
