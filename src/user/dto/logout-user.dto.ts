import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LogoutUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    readonly deviceId: string;
}