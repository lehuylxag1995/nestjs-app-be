import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductNotFoundException extends IBaseSpecialException {}

export class ProductNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: IProductNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Product';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
