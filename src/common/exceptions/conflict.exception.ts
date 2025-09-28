import { DomainException } from '@Exceptions/doamin.exception';
import { HttpStatus } from '@nestjs/common';

interface IBaseConflictException {
  message?: string;
  resource?: string;
  field?: string;
}
export abstract class BaseConflictException extends DomainException {
  constructor({ message, field, resource }: IBaseConflictException) {
    const defaultMessage =
      message || `${resource} với trường ${field} đã tồn tại`;

    super({ httpStatus: HttpStatus.CONFLICT, message: defaultMessage });
  }
}
