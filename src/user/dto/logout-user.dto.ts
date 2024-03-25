import { IsNotEmpty } from "class-validator";

export class LogoutUserDTO {
    @IsNotEmpty()
    readonly deviceId: string;
}