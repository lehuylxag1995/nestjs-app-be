import { DomainException } from '@Exceptions/doamin.exception';
import { IBaseResourceException } from '@Interfaces/base-exceptions.interface';
import { HttpStatus } from '@nestjs/common';

//Base[...]Exception quản lý chung: thông báo, httpstatus
export abstract class BaseNotFoundException extends DomainException {
  protected constructor({ resource, field, message }: IBaseResourceException) {
    let defaultMessage = `Dữ liệu không tìm thấy`;

    if (message) defaultMessage = message;
    else if (resource && field)
      if (Array.isArray(field))
        defaultMessage = `${resource} không tìm thấy${field ? ` với định danh ${field.join(', ')}` : ''}`;
      else
        defaultMessage = `${resource} không tìm thấy${field ? ` với định danh ${field}` : ''}`;

    super({ message: defaultMessage, httpStatus: HttpStatus.NOT_FOUND });
  }
}
