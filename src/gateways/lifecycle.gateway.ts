import { Injectable } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { LoggerService } from "src/logger/logger.service";
import { RoomService } from "src/room/room.service";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, Message, ServerToClientEvents } from "src/common/interfaces/chat.interface";
import { EntryPointGateWay } from "./entrypoint.gateway";

@Injectable()
export class LifecycleGateway extends EntryPointGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly logger: LoggerService,
        private readonly roomService: RoomService,
    ) {
        super();
    }

    @WebSocketServer() server: Server = new Server<ServerToClientEvents, ClientToServerEvents>()

    @SubscribeMessage('chat')
    async handleChatEvent(@MessageBody() payload: Message): Promise<Message> {
        this.logger.info(JSON.stringify(payload));
        this.server.to(payload.roomName).emit('chat', payload);
        return payload;
    }

    @SubscribeMessage('join_room')
    async handleSetClientDataEvent(
        @MessageBody() payload: Pick<Message, 'roomName' | 'user'>
    ): Promise<void> {
        if (payload.user.socketId) {
            this.logger.info(`${payload.user.socketId} is joining ${payload.roomName}`);
            await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
            await this.roomService.addUserToRoom(payload.roomName, payload.user);
        }
    }

    async afterInit() {
        this.logger.debug('Websockets initialized ' + this.constructor.name);
    }

    async handleConnection(socket: Socket): Promise<void> {
        this.logger.info(`Socket connected: ${socket.id}`);
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        await this.roomService.removeUserFromAllRooms(socket.id);
        this.logger.info(`Socket disconnect: ${socket.id}`);    
    }
}