import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DeviceModule } from "src/device/device.module";
import { AuthGuard } from "./guard/auth.guard";

@Module({
    imports: [
        DeviceModule,
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
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
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}