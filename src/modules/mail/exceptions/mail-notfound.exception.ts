import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IMailNotFoundException extends IBaseSpecialException {}

export class MailNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IMailNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Mail';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
