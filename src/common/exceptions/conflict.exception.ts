import { DomainException } from '@Exceptions/doamin.exception';
import { IBaseConflictException } from '@Interfaces/base-exceptions.interface';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseConflictException extends DomainException {
  constructor({ message, field, resource }: IBaseConflictException) {
    const defaultMessage =
      message || `${resource} với trường ${field} đã tồn tại`;

    super({ httpStatus: HttpStatus.CONFLICT, message: defaultMessage });
  }
}
