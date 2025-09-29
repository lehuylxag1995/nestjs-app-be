import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserBadRequestException extends IBaseSpecialException {}

export class UserBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IUserBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Người dùng`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
