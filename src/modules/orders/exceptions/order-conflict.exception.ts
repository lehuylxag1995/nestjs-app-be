import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderConflictException extends IBaseSpecialException {}

export class OrderConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IOrderConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Order`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
