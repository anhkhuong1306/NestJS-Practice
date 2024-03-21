import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginUserDTO } from 'src/user/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}
    
    @UsePipes(new ValidationPipe())
    @Post('login')
    async signIn(@Body() signInDto: LoginUserDTO) {
        return await this.authService.signIn(signInDto);
    }
}
