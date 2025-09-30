import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOtpConflictException extends IBaseSpecialException {}

export class OtpConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IOtpConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `OTP`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
