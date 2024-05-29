import { Injectable } from "@nestjs/common";
import { Room, UserSocket } from "src/common/interfaces/chat.interface";

@Injectable()
export class RoomService {
    /**
     * List rooms chat
     */
    private rooms: Room[] = [];

    /**
     * Add new room chat
     * 
     * @param roomName 
     * @param host 
     */
    async addRoom(roomName: string, host: UserSocket): Promise<void> {
        const room = await this.getRoomByName(roomName);
        if (room === -1) {
            await this.rooms.push({ name: roomName, host, users: [host] });
        }
    }

    /**
     * Remove room chat
     * 
     * @param roomName 
     */
    async removeRoom(roomName: string): Promise<void> {
        const roomIndex = await this.getRoomByName(roomName);
        if (roomIndex !== -1) {
            this.rooms = this.rooms.filter((room) => room.name !== roomName);
        }
    }

    /**
     * Get the host of room
     * 
     * @param hostName 
     * @returns 
     */
    async getRoomHost(hostName: string): Promise<UserSocket> {
        const roomIndex = await this.getRoomByName(hostName);
        return this.rooms[roomIndex].host;
    }

    /**
     * Get room by room's name
     * 
     * @param roomName 
     * @returns 
     */
    async getRoomByName(roomName: string): Promise<number> {
        const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
        return roomIndex;
    }

    /**
     * Add user to room chat
     * 
     * @param roomName 
     * @param user 
     */
    async addUserToRoom(roomName: string, user: UserSocket): Promise<void> {
        const roomIndex = await this.getRoomByName(roomName);
        if (roomIndex !== -1) {
            this.rooms[roomIndex].users.push(user);
            const host = await this.getRoomHost(roomName);
            if (host.userId === user.userId) {
                this.rooms[roomIndex].host.socketId = user.socketId;
            }
        } else {
            await this.addRoom(roomName, user);
        }
    }

    /**
     * Find all rooms which user currently join.
     * 
     * @param socketId 
     * @returns
     */
    async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
        const filteredRooms = this.rooms.filter((room) => {
            const found = room.users.find((user) => user.socketId === socketId);
            if (found) {
                return found;
            }
        });
        return filteredRooms;
    }

    /**
     * Remove the user from all joined rooms
     * 
     * @param socketId 
     */
    async removeUserFromAllRooms(socketId: string): Promise<void> {
        const rooms = await this.findRoomsByUserSocketId(socketId);
        for (const room of rooms) {
            await this.removeUserFromRoom(socketId, room.name);
        }
    }

    /**
     * Remove the user from room chat. 
     * 
     * @param socketId 
     * @param roomName 
     */
    async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
        const room = await this.getRoomByName(roomName);
        this.rooms[room].users = this.rooms[room].users.filter((user) => user.socketId !== socketId);
        if (this.rooms[room].users.length === 0) {
            await this.removeRoom(roomName);
        }
    }

    /**
     * Get list rooms chat
     * 
     * @returns 
     */
    async getRooms(): Promise<Room[]> {
        return this.rooms;
    }
}