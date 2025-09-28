import { DomainException } from '@Exceptions/doamin.exception';
import { HttpStatus } from '@nestjs/common';

export interface IBaseNotFoundExceptionOptions {
  resource: string;
  identity?: string;
  message?: string;
}

//Base[...]Exception quản lý chung: thông báo, httpstatus
export abstract class BaseNotFoundException extends DomainException {
  protected constructor({
    resource,
    identity,
    message,
  }: IBaseNotFoundExceptionOptions) {
    const defaultMessage =
      message ||
      `${resource} không tìm thấy${identity ? ` với định danh ${identity}` : ''}`;

    super({ message: defaultMessage, httpStatus: HttpStatus.NOT_FOUND });
  }
}
