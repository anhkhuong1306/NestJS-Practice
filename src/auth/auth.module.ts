import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>('secret'),
                    signOptions: {
                        expiresIn: '60s',
                    },
                };
            },
            inject: [ConfigService],
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}