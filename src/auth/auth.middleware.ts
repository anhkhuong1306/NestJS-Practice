import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from './auth.service';
import { PayLoad } from './auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    use(req: any, res: any, next: NextFunction) {
        const headers = req.headers;
        if (headers && (headers.authorization)) {
            const payload: PayLoad = this.authService.getPayLoad(headers);
            req.payload = payload;
            req.token = headers.authorization.split(' ')[1];
            next();
        } else {
            return res.status(401).send({
                "message": "Unauthorized",
                "statusCode": 401
            });
        }
    }
}