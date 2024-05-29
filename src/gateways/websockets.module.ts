import { Module } from "@nestjs/common";
import { LifecycleGateway } from "./lifecycle.gateway";
import { RoomModule } from "src/room/room.module";
import { LoggerModule } from "src/logger/logger.module";

@Module({
    imports: [RoomModule, LoggerModule],
    providers: [LifecycleGateway],
    exports: [LifecycleGateway]
})
export class WebsocketModule {}