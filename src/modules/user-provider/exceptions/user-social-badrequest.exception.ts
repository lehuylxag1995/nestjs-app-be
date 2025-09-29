import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IUserSocialBadRequestException extends IBaseSpecialException {}

export class UserSocialBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IUserSocialBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Tài khoản mạng xã hội`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
