import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOtpNotFoundException extends IBaseSpecialException {}

export class OtpNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IOtpNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'OTP';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
