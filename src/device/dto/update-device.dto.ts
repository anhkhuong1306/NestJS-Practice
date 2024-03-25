import { IsNotEmpty, Allow, IsDefined } from "class-validator";
export class UpdateDeviceSessionDTO {
    @IsDefined()
    @IsNotEmpty()
    readonly id: string;
  
    readonly deviceId?: string;
    readonly name?: string;
    readonly ua?: string;
    readonly secretKey?: string;
    readonly refreshToken?: string;
    readonly expiredAt?: Date;
    readonly ipAddress?: string;
    readonly user?: string
}