import { BaseConflictException } from '@Exceptions/conflict.exception';

interface IUserSocialConflictException {
  field: string;
  message?: string;
  resource?: string;
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
