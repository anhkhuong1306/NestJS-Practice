import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { ApiName } from 'src/decorators/api-name.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const [req, res] = context.getArgs();

        const methodNam = context.getHandler().name;
        const className = context.getClass().name;

        const apiName = this.reflector.get<string>(ApiName, context.getHandler());
        console.log(`${className}::${methodNam}: API ${apiName} START`);

        return next.handle().pipe(
            tap((x) => console.log(`${className}::${methodNam}: API ${apiName} END`))
        );
    }
}