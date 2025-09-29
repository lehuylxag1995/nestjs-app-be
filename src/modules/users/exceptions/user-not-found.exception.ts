import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserNotFoundException extends IBaseSpecialException {}

// Exception cụ thể quản lý resource
export class UserNotFoundException extends BaseNotFoundException {
  public readonly code: string | undefined;

  constructor(options: IUserNotFoundException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
