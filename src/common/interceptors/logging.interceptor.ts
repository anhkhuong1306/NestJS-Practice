import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { ApiName } from 'src/common/decorators/api-name.decorator';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private logger: LoggerService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const [req, res] = context.getArgs();

        const methodNam = context.getHandler().name;
        const className = context.getClass().name;

        const apiName = this.reflector.get<string>(ApiName, context.getHandler());
        this.logger.info(`API ${apiName} [[START]]`, `${className}::${methodNam}`);

        return next.handle().pipe(
            tap({
                complete: () => this.logger.info(`API ${apiName} [[END]]`, `${className}::${methodNam}`),
                error: (error) => this.logger.error(`API ${apiName} [[ERROR]]`, `${className}::${methodNam}`, error),
            })
        );
    }
}
