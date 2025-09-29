import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseNotFoundException } from '@Interfaces/base-exceptions.interface';

interface IUserSocialNotFoundException extends IBaseNotFoundException {
  code?: string;
}

export class UserSocialNotFoundException extends BaseNotFoundException {
  public readonly code?: string;
  constructor(params: IUserSocialNotFoundException = {}) {
    const { identity, message, resource, code } = params;

    const defaultResource = resource || 'Tài khoản mạng xã hội';

    super({ resource: defaultResource, identity, message });

    this.code = code;
  }
}
