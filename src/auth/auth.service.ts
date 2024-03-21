import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDTO } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { UserAuthRO } from 'src/user/user.inteface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor (
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn({email, password}: LoginUserDTO): Promise<UserAuthRO> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (! await argon2.verify(user.password, password)) {
            throw new UnauthorizedException();
        }

        const access_token = await this.generateJWT(user);
        return this.buildUserAuthRO(user, access_token);
    }

    async generateJWT(user: UserEntity) {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);
    
        return await this.jwtService.signAsync({
          id: user.id,
          username: user.username,
          email: user.email,
        });
    };

    buildUserAuthRO(user: UserEntity, token: string) {
        const userRO = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image,
            token: token
        };

        return {user: userRO};
    }
}
