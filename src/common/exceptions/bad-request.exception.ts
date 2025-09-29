import { DomainException } from '@Exceptions/doamin.exception';
import { IBaseResourceException } from '@Interfaces/base-exceptions.interface';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseBadRequestException extends DomainException {
  constructor({ message, resource, field }: IBaseResourceException) {
    let defaultMessage = `Dữ liệu không hợp lệ`;

    if (message) {
      defaultMessage = message;
    } else if (resource && field) {
      if (Array.isArray(field)) {
        defaultMessage = `${resource} có dữ liệu không hợp lệ ở các trường:${field.join(', ')}`;
      } else
        defaultMessage = `${resource} có dữ liệu không hợp lệ ở các trường:${field}`;
    }

    super({ httpStatus: HttpStatus.BAD_REQUEST, message: defaultMessage });
  }
}
