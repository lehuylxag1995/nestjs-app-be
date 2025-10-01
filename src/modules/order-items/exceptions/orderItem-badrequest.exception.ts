import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderItemBadRequestException extends IBaseSpecialException {}

export class OrderItemBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IOrderItemBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `OrderItem`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
