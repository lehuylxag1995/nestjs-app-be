import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface ICategoryConflictException extends IBaseSpecialException {}

export class CategoryConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: ICategoryConflictException) {
    const { field, code, message, resource } = params;

    const defaultResource = resource || `Danh mục`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
