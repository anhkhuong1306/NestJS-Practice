import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsNotEmpty, IsEmail } from "class-validator";
export class UpdateUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    
    @ApiProperty()
    readonly bio: string;

    @ApiProperty()
    readonly image: string;
}