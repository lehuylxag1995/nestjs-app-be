import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
interface IUserSocialBadRequestException {
  message?: string;
  resource?: string;
  field?: string | string[];
  code?: string;
}
export class UserSocialBadRequestException extends BaseBadRequestException {
  public readonly code?: string;
  constructor(options: IUserSocialBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Tài khoản mạng xã hội`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
