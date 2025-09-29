import { HttpStatus } from '@nestjs/common';

export interface IDomainException {
  message: string;
  httpStatus: HttpStatus;
}

export interface IBaseBadRequestException {
  message?: string;
  resource?: string;
  field?: string | string[];
}

export interface IBaseConflictException {
  message?: string;
  resource?: string;
  field: string;
}

export interface IBaseNotFoundException {
  resource?: string;
  identity?: string;
  message?: string;
}
