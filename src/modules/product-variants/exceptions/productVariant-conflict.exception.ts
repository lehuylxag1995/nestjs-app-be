import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductVariantConflictException extends IBaseSpecialException {}

export class ProductVariantConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: IProductVariantConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `ProductVariant`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
