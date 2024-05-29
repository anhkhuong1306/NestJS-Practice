import { Controller, Get, Param } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room } from "src/common/interfaces/chat.interface";

@Controller()
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get('/rooms')
    async getAllRooms(): Promise<Room[]> {
        return await this.roomService.getRooms();
    }

    @Get('/rooms/:room')
    async getRoom(@Param() params): Promise<Room> {
        const rooms = await this.roomService.getRooms();
        const room = await this.roomService.getRoomByName(params.room);
        return rooms[room];
    }
}