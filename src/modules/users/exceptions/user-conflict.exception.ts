import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserConflictException extends IBaseSpecialException {}

export class UserConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(options: IUserConflictException) {
    const { message, resource, field, code } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
