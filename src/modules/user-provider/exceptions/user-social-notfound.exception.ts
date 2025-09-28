import { BaseNotFoundException } from '@Exceptions/not-found.exception';

interface IUserSocialNotFoundException {
  message?: string;
  resource?: string;
  identity?: string;
}

export class UserSocialNotFoundException extends BaseNotFoundException {
  constructor(params: IUserSocialNotFoundException = {}) {
    const { identity, message, resource } = params;

    const defaultResource = resource || 'Tài khoản mạng xã hội';

    super({ resource: defaultResource, identity, message });
  }
}
