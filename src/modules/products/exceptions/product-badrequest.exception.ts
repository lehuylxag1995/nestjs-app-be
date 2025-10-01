import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IProductBadRequestException extends IBaseSpecialException {}

export class ProductBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IProductBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Product`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
