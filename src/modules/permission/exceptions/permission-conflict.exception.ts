import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IPermissionConflictException extends IBaseSpecialException {}

export class PermissionConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IPermissionConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Quyền hạn`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
