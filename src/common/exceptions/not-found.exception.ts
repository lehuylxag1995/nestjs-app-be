import { DomainException } from '@Exceptions/doamin.exception';
import { IBaseNotFoundException } from '@Interfaces/base-exceptions.interface';
import { HttpStatus } from '@nestjs/common';

//Base[...]Exception quản lý chung: thông báo, httpstatus
export abstract class BaseNotFoundException extends DomainException {
  protected constructor({
    resource,
    identity,
    message,
  }: IBaseNotFoundException) {
    const defaultMessage =
      message ||
      `${resource} không tìm thấy${identity ? ` với định danh ${identity}` : ''}`;

    super({ message: defaultMessage, httpStatus: HttpStatus.NOT_FOUND });
  }
}
