import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DeviceModule } from "src/device/device.module";
import { AuthGuard } from "./guard/auth.guard";
import { LoggerModule } from "src/logger/logger.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    signOptions: {
                        expiresIn: '60s',
                    },
                };
            },
            inject: [ConfigService],
        }),
        DeviceModule,
        LoggerModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}