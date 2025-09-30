import { HttpStatus } from '@nestjs/common';

export interface IDomainException {
  message: string;
  httpStatus: HttpStatus;
}

export interface IBaseResourceException {
  message?: string;
  resource?: string;
  field?: string | string[];
}

export interface IBaseSpecialException extends IBaseResourceException {
  code?: string;
}
