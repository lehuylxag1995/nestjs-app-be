import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IRoleBadRequestException extends IBaseSpecialException {}

export class RoleBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IRoleBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Vai trò`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
