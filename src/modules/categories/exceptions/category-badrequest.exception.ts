import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface ICategoryBadRequestException extends IBaseSpecialException {}

export class CategoryBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: ICategoryBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Danh mục`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
