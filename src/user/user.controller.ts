import { HttpException, ParseIntPipe, UseGuards, UseInterceptors } from "@nestjs/common";
import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from "./user.service";
import { CreateUserDTO, UpdateUserDTO, LoginUserDTO } from "./dto";
import { ValidationPipe } from "@nestjs/common";
import { UserRO } from "./user.inteface";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { JwtPublic } from "src/auth/auth.decorator";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthService } from "src/auth/auth.service";
import { LoggingInterceptor } from "src/common/interceptors/logging.interceptor";
import { ApiName } from "src/common/decorators/api-name.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('real-world')
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiName('Get List User')
    @Get()
    @JwtPublic(false)
    async find(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @ApiName('Get User Detail')
    @Get('detail/:id')
    async detail(@Param('id') id: number): Promise<UserRO> {
        return await this.userService.findByID(id);
    }

    @ApiName('Create User')
    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() body: CreateUserDTO) {
        return await this.userService.create(body);
    }

    @ApiName('Update User')
    @UsePipes(new ValidationPipe())
    @Put()
    async update(@Body('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
        return await this.userService.update(id, body);
    }

    @ApiName('Delete User')
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }


}