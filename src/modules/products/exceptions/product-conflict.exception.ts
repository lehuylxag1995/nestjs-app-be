import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductConflictException extends IBaseSpecialException {}

export class ProductConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IProductConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Product`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
