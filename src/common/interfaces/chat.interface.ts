export interface UserSocket {
    userId: string,
    username: string,
    socketId: string
}

export interface Room {
    name: string,
    host: UserSocket,
    users: UserSocket[]
}

export interface Message {
    user: UserSocket,
    timeSent: string,
    message: string,
    roomName: string
}

export interface ServerToClientEvents {
    chat: (e: Message) => void
}

export interface ClientToServerEvents {
    chat: (e: Message) => void,
    join_room: (e: { user: UserSocket, roomName: string}) => void
}