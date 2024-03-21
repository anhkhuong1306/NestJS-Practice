import { HttpException } from "@nestjs/common";
import { NestMiddleware, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction} from 'express';
import { UserService } from "./user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}
    
    use(req: any, res: any, next: (error?: any) => void) {
        throw new Error("Method not implemented.");
    }
}