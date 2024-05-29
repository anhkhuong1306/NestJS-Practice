import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({path: '/entrypoint', cors: true})
export class EntryPointGateWay {}