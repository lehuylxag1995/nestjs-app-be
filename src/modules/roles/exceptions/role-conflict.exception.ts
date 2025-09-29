import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IRoleConflictException extends IBaseSpecialException {}

export class RoleConflictException extends BaseConflictException {
  public readonly code?: string;
  constructor(params: IRoleConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Vai trò`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
