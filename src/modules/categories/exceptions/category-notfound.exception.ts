import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface ICategoryNotFoundException extends IBaseSpecialException {}

export class CategoryNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(options: ICategoryNotFoundException) {
    const { resource, field, message, code } = options;

    const defaultResource = resource || 'Danh mục';

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
