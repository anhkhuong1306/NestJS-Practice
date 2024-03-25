import { HttpException, ParseIntPipe, UseGuards } from "@nestjs/common";
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

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @JwtPublic(false)
    async find(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @Get('detail/:id')
    async detail(@Param('id') id: number): Promise<UserRO> {
        return await this.userService.findByID(id);
    }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body('user') userData: CreateUserDTO) {
        return await this.userService.create(userData);
    }

    @UsePipes(new ValidationPipe())
    @Put()
    async update(@Body('id', ParseIntPipe) id: number, @Body('user') userData: UpdateUserDTO) {
        return await this.userService.update(id, userData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }


}