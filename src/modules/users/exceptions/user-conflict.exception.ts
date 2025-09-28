import { BaseConflictException } from '@Exceptions/conflict.exception';

interface IUserConflictException {
  message?: string;
  resource?: string;
  field: string;
}
export class UserConflictException extends BaseConflictException {
  constructor(options: IUserConflictException) {
    const { message, resource, field } = options;

    const defaultResource = resource || 'Người dùng';

    super({ resource: defaultResource, field, message });
  }
}
