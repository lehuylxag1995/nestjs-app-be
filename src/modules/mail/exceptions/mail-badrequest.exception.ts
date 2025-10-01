import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IMailBadRequestException extends IBaseSpecialException {}

export class MailBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IMailBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Mail`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
