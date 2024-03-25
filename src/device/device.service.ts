import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { DeviceSessionEntity } from './device.entity';
import { Repository } from 'typeorm';
import { RefreshTokenDTO } from '../auth/dto/refresh-token.dto';
import { CreateDeviceSessionDTO } from './dto/create-device.dto';
import { validate } from 'class-validator';
import { DeviceSessionRO } from './device.interface';
import { UpdateDeviceSessionDTO } from './dto';
import { UserEntity } from 'src/user/user.entity';
import { GetDeviceDTO } from './dto/get-device.dto';
import { DeleteDeviceSessionDTO } from './dto/delete-device.dto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(DeviceSessionEntity)
        private deviceRepository: Repository<DeviceSessionEntity>,
    ) {}

    async getRefreshToken({deviceId, refreshToken}: RefreshTokenDTO) : Promise<DeviceSessionEntity> {
        return await this.deviceRepository.createQueryBuilder('devices')
                                            .leftJoinAndSelect(UserEntity, 'users', 'users.id = devices.userId')
                                            .where('devices.refreshToken = :refreshToken', { refreshToken })
                                            .andWhere('devices.deviceId = :deviceId', { deviceId })
                                            .getOne();
    }

    async getDeviceSession(deviceCondition: GetDeviceDTO): Promise<DeviceSessionEntity> {
        return await this.deviceRepository.findOne({where: {deviceId: deviceCondition.deviceId}});
    }

    async createDeviceSession(deviceSession: CreateDeviceSessionDTO): Promise<DeviceSessionRO> {
        const errors = await validate(deviceSession);
        if (errors.length > 0) {
            throw new HttpException({ message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        } else {    
            const savedDeviceSession = await this.deviceRepository.save(deviceSession);
            return this.buildDeviceSessionRO(savedDeviceSession);
        }
    }   

    async updateDeviceSession(deviceSession: UpdateDeviceSessionDTO): Promise<boolean> {
        const errors = await validate(deviceSession);
        if (errors.length > 0) {
            throw new HttpException({ message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        } else {    
            const savedDeviceSession = await this.deviceRepository.update(deviceSession.id, deviceSession);
            return (savedDeviceSession.affected != 0) ? true : false;
        }
    }

    async deleteDeviceSession(deviceSession: DeleteDeviceSessionDTO): Promise<boolean> {
        const deletedDeviceSession = await this.deviceRepository.delete(deviceSession);
        if (deletedDeviceSession !== null && deletedDeviceSession.affected !== 0) {
            return true;
        }
        return false;
    }

    public buildDeviceSessionRO(deviceSession: DeviceSessionRO) {
        const deviceRO = {
            id: deviceSession.id,
            deviceId: deviceSession.deviceId,
            name: deviceSession.name,
            ua: deviceSession.ua,
            secretKey: deviceSession.secretKey,
            expiredAt: deviceSession.expiredAt,
            refreshToken: deviceSession.refreshToken,
            ipAddress: deviceSession.ipAddress,
            user: deviceSession.user,
        };

        return deviceRO;
    }
}
