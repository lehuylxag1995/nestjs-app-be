import { BaseNotFoundException } from '@Exceptions/not-found.exception';
interface IUserNotFoundException {
  identity?: string;
  message?: string;
  resource?: string;
}

// Exception cụ thể quản lý resource
export class UserNotFoundException extends BaseNotFoundException {
  constructor(options: IUserNotFoundException = {}) {
    const { identity, message, resource } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, identity, message });
  }
}
