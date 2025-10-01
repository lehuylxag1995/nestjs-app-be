import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductVariantNotFoundException extends IBaseSpecialException {}

export class ProductVariantNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IProductVariantNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'ProductVariant';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
