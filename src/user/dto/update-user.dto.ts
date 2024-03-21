import { IsString, IsInt, IsNotEmpty, IsEmail } from "class-validator";
export class UpdateUserDTO {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    
    readonly bio: string;
    readonly image: string;
}