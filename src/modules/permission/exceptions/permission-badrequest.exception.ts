import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IPermissionBadRequestException extends IBaseSpecialException {}

export class PermissionBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IPermissionBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Quyền hạn`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
