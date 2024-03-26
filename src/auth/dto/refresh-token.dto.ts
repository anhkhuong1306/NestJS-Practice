import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDTO {
    @ApiProperty()
    readonly deviceId?: string;
    @ApiProperty()
    readonly refreshToken: string;
}