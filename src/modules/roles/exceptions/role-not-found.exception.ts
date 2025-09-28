import { BaseNotFoundException } from '@Exceptions/not-found.exception';

interface IRoleNotFoundException {
  resource?: string;
  identity?: string;
  message?: string;
}

export class RoleNotFoundException extends BaseNotFoundException {
  constructor(options: IRoleNotFoundException = {}) {
    const { resource, identity, message } = options;

    const defaultResource = resource || 'Vai trò';

    super({ resource: defaultResource, identity, message });
  }
}
