import { BaseConflictException } from '@Exceptions/conflict.exception';

interface IUserConflictException {
  message?: string;
  resource?: string;
  field: string;
  code?: string;
}
export class UserConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(options: IUserConflictException) {
    const { message, resource, field, code } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
