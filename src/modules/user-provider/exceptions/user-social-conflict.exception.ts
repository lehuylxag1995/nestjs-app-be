import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseConflictException } from '@Interfaces/base-exceptions.interface';

interface IUserSocialConflictException extends IBaseConflictException {
  code?: string;
}

export class UserSocialConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(options: IUserSocialConflictException) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || 'Tài khoản mạng xã hội';

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
