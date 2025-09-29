import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseBadRequestException } from '@Interfaces/base-exceptions.interface';

interface ITokenBadRequestException extends IBaseBadRequestException {
  code?: string;
}

export class TokenBadRequestException extends BaseBadRequestException {
  public readonly code?: string;
  constructor(options: ITokenBadRequestException) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Token`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
