import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]), 
        forwardRef(() => AuthModule)
    ],
    providers: [
        UserService,
    ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}