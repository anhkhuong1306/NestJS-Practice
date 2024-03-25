import { Req, Headers, Body, Controller, Post, UsePipes, ValidationPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoginUserDTO, LogoutUserDTO } from 'src/user/dto';
import { AuthService } from './auth.service';
import { LoginMetaData, LogoutRO } from 'src/device/device.interface';
import { AuthGuard } from './guard/auth.guard';
import { ApiName } from 'src/decorators/api-name.decorator';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}
    
    @ApiName('Login')
    @UsePipes(new ValidationPipe())
    @Post('login')
    async signIn(@Req() req, @Headers() headers: Headers, @Body() signInDto: LoginUserDTO) {
        const fingerprint = req.fingerprint;
        const ipAddress = req.connection.remoteAddress;
        const ua = headers['user-agent'];
        const deviceId = fingerprint.hash;
        const metaData: LoginMetaData = { ipAddress, ua, deviceId };
        return await this.authService.signIn(signInDto, metaData);
    }

    @ApiName('Logout')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('logout')
    async signOut(@Req() req): Promise<LogoutRO> {
        const { deviceId, id }  = req.payload;
        return await this.authService.signOut(id, deviceId);
    }

    @ApiName('Refresh Token')
    @Post('refresh-token')
    async refreshToken(@Req() req, @Body('refreshToken') refreshToken: string) {
        const deviceId = req.fingerprint.hash;
        return await this.authService.refreshToken(deviceId, refreshToken);
    }
}
