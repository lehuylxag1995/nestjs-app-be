import { DomainException } from '@Exceptions/doamin.exception';
import { IBaseResourceException } from '@Interfaces/base-exceptions.interface';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseConflictException extends DomainException {
  constructor({ message, field, resource }: IBaseResourceException) {
    let defaultMessage = `Dữ liệu xung đột`;
    if (message) {
      defaultMessage = message;
    } else if (resource && field) {
      if (Array.isArray(field)) {
        defaultMessage = `${resource} có dữ liệu không hợp lệ ở các trường:${field.join(', ')}`;
      } else
        defaultMessage = `${resource} có dữ liệu không hợp lệ ở các trường:${field}`;
    }

    super({ httpStatus: HttpStatus.CONFLICT, message: defaultMessage });
  }
}
