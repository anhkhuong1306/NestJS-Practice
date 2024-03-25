import { IsNotEmpty } from "class-validator";
export class CreateDeviceSessionDTO {
    @IsNotEmpty()
    readonly id: string;

    @IsNotEmpty()
    readonly deviceId: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly ua: string;

    @IsNotEmpty()
    readonly secretKey: string;

    @IsNotEmpty()
    readonly refreshToken: string;

    @IsNotEmpty()
    readonly expiredAt: Date;

    @IsNotEmpty()
    readonly ipAddress: string;

    @IsNotEmpty()
    readonly user: string
}