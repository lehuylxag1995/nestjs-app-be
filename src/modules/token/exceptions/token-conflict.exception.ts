import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface ITokenConflictException extends IBaseSpecialException {}

export class TokenConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: ITokenConflictException) {
    const { field, message, resource, code } = params;

    const defaultResource = resource || `Token`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
