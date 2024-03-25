import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceSessionEntity } from './device.entity';
import { UserEntity } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceSessionEntity, UserEntity]),
  ],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
