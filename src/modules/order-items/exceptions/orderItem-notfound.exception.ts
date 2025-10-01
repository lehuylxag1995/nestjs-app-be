import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderItemNotFoundException extends IBaseSpecialException {}

export class OrderItemNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IOrderItemNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'OrderItem';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
