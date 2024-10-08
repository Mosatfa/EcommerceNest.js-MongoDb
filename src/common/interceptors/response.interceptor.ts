import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { format } from 'date-fns'; //npm install date-fns // npm install @types/date-fns --save-dev

export type Response<T> = {
    status: boolean;
    statusCode: number;
    path: string;
    message: string;
    results: T;
    timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            catchError((err: HttpException) =>
                throwError(() => this.errorHandler(err, context)),
            ),
        );
    }

    errorHandler(exception: HttpException, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            status: false,
            statusCode: status,
            // path: request.url,
            message: exception.message,
            result: exception,
            timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),  // Fix here
        });
    }

    responseHandler(res: any, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = response.statusCode;
      
        return {
          status: true,
          path: request.url,
          message: 'Done',  // Add a default message here
          statusCode,
          results: res,
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
      }
}