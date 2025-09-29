import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IRoleNotFoundException extends IBaseSpecialException {}

export class RoleNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IRoleNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Vai trò';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
