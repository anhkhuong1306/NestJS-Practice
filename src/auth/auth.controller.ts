import { Req, Headers, Body, Controller, Post, UsePipes, ValidationPipe, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { LoginUserDTO, LogoutUserDTO } from 'src/user/dto';
import { AuthService } from './auth.service';
import { LoginMetaData, LogoutRO } from 'src/device/device.interface';
import { AuthGuard } from './guard/auth.guard';
import { ApiName } from 'src/common/decorators/api-name.decorator';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from 'src/common/exception/all-exceptions.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDTO } from './dto';

@ApiTags('real-world')
@UseFilters(AllExceptionsFilter)
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
    @ApiBearerAuth()
    @ApiName('Logout')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('logout')
    async signOut(@Req() req): Promise<LogoutRO> {
        const { deviceId, id }  = req.payload;
        return await this.authService.signOut(id, deviceId);
    }

    @ApiBearerAuth()
    @ApiName('Refresh Token')
    @Post('refresh-token')
    async refreshToken(@Req() req, @Body() body: RefreshTokenDTO) {
        const deviceId = req.fingerprint.hash;
        return await this.authService.refreshToken(deviceId, body.refreshToken);
    }
}
