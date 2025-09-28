import { BaseNotFoundException } from '@Exceptions/not-found.exception';
interface IUserNotFoundException {
  identity?: string;
  message?: string;
  resource?: string;
  code?: string;
}

// Exception cụ thể quản lý resource
export class UserNotFoundException extends BaseNotFoundException {
  public readonly code: string | undefined;

  constructor(options: IUserNotFoundException = {}) {
    const { identity, message, resource, code } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, identity, message });

    this.code = code;
  }
}
