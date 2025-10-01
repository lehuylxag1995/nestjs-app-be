import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductVariantBadRequestException extends IBaseSpecialException {}

export class ProductVariantBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IProductVariantBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `ProductVariant`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
