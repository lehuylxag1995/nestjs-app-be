import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseSpecialException } from '@Interfaces/base-exceptions.interface';

interface ITokenNotFoundException extends IBaseSpecialException {}

export class TokenNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(params: ITokenNotFoundException = {}) {
    const { code, field, message, resource } = params;

    const defaultResource = resource || `Token`;

    super({ resource: defaultResource, field, message });

    this.code = code;
  }
}
