import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IPermissionNotFoundException extends IBaseSpecialException {}

export class PermissionNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IPermissionNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Quyền hạn';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
