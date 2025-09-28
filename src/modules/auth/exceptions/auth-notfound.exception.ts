import { BaseBadRequestException } from '@Exceptions/bad-request.exception';

interface IAuthBadRequestException {
  message?: string;
  resource?: string;
  field?: string;
  code?: string;
}
export class AuthBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(params: IAuthBadRequestException = {}) {
    const { field, message, resource, code } = params;

    const defaultResource = resource || `Xác thực tài khoản`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
