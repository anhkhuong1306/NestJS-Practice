import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private authService: AuthService,
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get('IsPublic', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const validated = await this.validateRequest(request);

        // If route is public and don't need verify, pass to process.
        if (isPublic) {
            return true;
        }

        if (!validated) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private async validateRequest(request): Promise<boolean> {
        const payload = request.payload;
        const token = request.token;

        if (!payload) {
            return false;
        }
        
        const checkDeviceId = request.fingerprint.hash;
        const deviceId = payload['deviceId'];
        
        if (checkDeviceId !== deviceId) {
            throw new UnauthorizedException('Token not issued for this device.');
        }            

        try {
            const secretKey: string = await this.authService.getSecretKey(payload);
            return !!this.jwtService.verify(token, { secret: secretKey });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}