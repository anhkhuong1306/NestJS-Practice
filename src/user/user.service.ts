import { Injectable } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { DeleteResult, Repository } from "typeorm";
import * as argon2 from 'argon2';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "./dto";
import { UserRO } from "./user.inteface";
import { validate } from "class-validator";
const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return this.usersRepository.find();
    }

    async findByID(id: number): Promise<UserRO> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            return null;
        }

        return this.buildUserRO(user);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) {
            return null;
        }

        return user;
    }

    async create(dto: CreateUserDTO): Promise<UserRO> {
        const { username, email, password } = dto;
        const qb = await this.usersRepository.createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.email = :email', { email });
        const user = await qb.getOne();

        if (user) {
            const errors = {username: 'Username and email must be unique'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        let newUser = new UserEntity();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        
        const errors = await validate(newUser);
        if (errors.length > 0) {
            const _errors = {username: 'User input is not valid.'};
            throw new HttpException({ message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.usersRepository.save(newUser);
            return this.buildUserRO(savedUser);
        }
    }

    async update(id: number, dto: UpdateUserDTO): Promise<UserEntity> {
        let user = await this.usersRepository.findOneBy({id});
        if (user) {
            delete user.password;
            user.username = dto.username;
            user.email = dto.email;
            return await this.usersRepository.save(user);
        }
        return null;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.usersRepository.delete({ id });
    }

    public buildUserRO(user: UserEntity) {
        const userRO = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image
        };

        return {user: userRO};
    }
}