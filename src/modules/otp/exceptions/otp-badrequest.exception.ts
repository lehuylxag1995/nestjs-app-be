import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOtpBadRequestException extends IBaseSpecialException {}

export class OtpBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IOtpBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `OTP`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
