import { HttpStatus } from '@nestjs/common';

// Tạo tham số cho Domain
export interface IDomainExceptionOptions {
  message: string;
  httpStatus: HttpStatus;
}

// Bạn muốn code ném ra lỗi cụ thể như UserNotFoundException, không phải new DomainException("Có lỗi xảy ra")
export abstract class DomainException extends Error {
  // httpStatus phải là public readonly để Exception Filter có thể đọc được
  public readonly httpStatus: HttpStatus;

  constructor({
    httpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message,
  }: IDomainExceptionOptions) {
    // Gọi constructor của Error, truyền message
    super(message);

    // Gán tên lớp hiện tại (ví dụ: 'UserNotFoundException')
    this.name = new.target.name;
    this.httpStatus = httpStatus;
  }
}
