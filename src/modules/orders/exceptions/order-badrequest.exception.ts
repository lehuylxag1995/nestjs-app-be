import { BaseBadRequestException } from '@Exceptions/bad-request.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface IOrderBadRequestException extends IBaseSpecialException {}

export class OrderBadRequestException extends BaseBadRequestException {
  public readonly code?: string;

  constructor(options: IOrderBadRequestException = {}) {
    const { field, message, resource, code } = options;

    const defaultResource = resource || `Order`;

    super({ field, message, resource: defaultResource });

    this.code = code;
  }
}
