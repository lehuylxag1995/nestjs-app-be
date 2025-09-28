import { DomainException } from '@Exceptions/doamin.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(DomainException)
export class DomainToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Error của typescript  -> giao thức chuẩn Http API
    return response.status(exception.httpStatus).json({
      statusCode: exception.httpStatus,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      method: request.method,
    });
  }
}
