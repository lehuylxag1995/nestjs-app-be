import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserSocialConflictException extends IBaseSpecialException {}

export class UserSocialConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(options: IUserSocialConflictException) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || 'Tài khoản mạng xã hội';

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
