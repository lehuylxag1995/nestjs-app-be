import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderNotFoundException extends IBaseSpecialException {}

export class OrderNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IOrderNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Order';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
