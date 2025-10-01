import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderItemConflictException extends IBaseSpecialException {}

export class OrderItemConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IOrderItemConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `OrderItem`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
