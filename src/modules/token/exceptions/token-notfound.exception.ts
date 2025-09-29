import { BaseNotFoundException } from '@Exceptions/not-found.exception';
import { IBaseNotFoundException } from '@Interfaces/base-exceptions.interface';

interface ITokenNotFoundException extends IBaseNotFoundException {
  code?: string;
}

export class TokenNotFoundException extends BaseNotFoundException {
  public readonly code?: string;

  constructor(params: ITokenNotFoundException = {}) {
    const { code, identity, message, resource } = params;

    const defaultResource = resource || `Token`;

    super({ resource: defaultResource, identity, message });

    this.code = code;
  }
}
