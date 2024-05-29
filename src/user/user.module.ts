import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { LoggerModule } from "src/logger/logger.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]), 
        forwardRef(() => AuthModule),
        LoggerModule,
    ],
    providers: [
        UserService,
    ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}