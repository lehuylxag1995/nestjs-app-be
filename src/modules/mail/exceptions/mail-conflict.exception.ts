import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IMailConflictException extends IBaseSpecialException {}

export class MailConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IMailConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Mail`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
