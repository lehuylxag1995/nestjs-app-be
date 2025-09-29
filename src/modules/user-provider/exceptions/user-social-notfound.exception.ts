import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserSocialNotFoundException extends IBaseSpecialException {}

export class UserSocialNotFoundException extends BaseNotFoundException {
  public readonly code?: string;
  constructor(params: IUserSocialNotFoundException = {}) {
    const { field, message, resource, code } = params;

    const defaultResource = resource || 'Tài khoản mạng xã hội';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
