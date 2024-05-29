import { AuthModule } from "src/auth/auth.module";
import { LoggerModule } from "src/logger/logger.module";
import { RoomService } from "./room.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        LoggerModule,
    ],
    providers: [RoomService,],
    controllers: [],
    exports: [RoomService]
})
export class RoomModule {}