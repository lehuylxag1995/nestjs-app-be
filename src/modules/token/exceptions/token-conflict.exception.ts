import { BaseConflictException } from '@Exceptions/conflict.exception';
import { IBaseConflictException } from '@Interfaces/base-exceptions.interface';

interface ITokenConflictException extends IBaseConflictException {
  code?: string;
}

export class TokenConflictException extends BaseConflictException {
  public readonly code?: string;

  constructor(params: ITokenConflictException) {
    const { field, message, resource, code } = params;

    const defaultResource = resource || `Token`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
