import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoginUserDTO } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { LoginMetaData, LoginRO, LogoutRO } from 'src/device/device.interface';
import { DeviceService } from 'src/device/device.service';
import { DeviceSessionEntity } from 'src/device/device.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateDeviceSessionDTO } from 'src/device/dto';
import { Cache } from 'cache-manager';
import * as randomatic from 'randomatic';
import * as argon2 from 'argon2';
import addDay from 'src/common/helpers/addDay';
import { PayLoad } from './auth.interface';

const { randomUUID } = require('crypto');
const EXP_SESSION = 7;

@Injectable()
export class AuthService {
    constructor (
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private userService: UserService,
        private deviceService: DeviceService,
        private jwtService: JwtService,
    ) {}

    async signIn({email, password}: LoginUserDTO, metaData: LoginMetaData): Promise<LoginRO> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (! await argon2.verify(user.password, password)) {
            throw new UnauthorizedException();
        }

        return this.handleDeviceSession((user.id).toString(), metaData);
    }

    async signOut(userId: string, deviceId: string): Promise<LogoutRO> {
        const currentDevice = await this.deviceService.getDeviceSession({deviceId});

        if (!currentDevice || currentDevice.user !== userId) {
            throw new ForbiddenException();
        }

        const keyCache = `sk_${userId}_${deviceId}`;

        await this.cacheManager.set(keyCache, null);
        const result = this.deviceService.deleteDeviceSession({deviceId});
        
        if (result) {
            return {
                message: 'Logout success.',
                status: '200',
                deviceId
            };
        }
        return {
            message: 'Logout fail.',
            status: '401',
            deviceId
        };
    }

    async refreshToken(deviceId: string, refreshToken: string): Promise<LoginRO> {
        const deviceSession: DeviceSessionEntity = await this.deviceService.getRefreshToken({deviceId, refreshToken});
        if (!deviceSession || new Date(deviceSession.expiredAt).valueOf() < new Date().valueOf()) {
            throw new UnauthorizedException('Refresh token invalid');
        }

        const payload = {
            id: deviceSession.user,
            deviceId,
        };

        const newSecretKey = this.generateSecretKey();
        const [newToken, newRefreshToken, newExpiredAt] = [this.jwtService.sign(payload, { secret: newSecretKey }), randomatic('Aa0', 64), addDay(7)];

        const updateDeviceSession: UpdateDeviceSessionDTO = {
            id: deviceSession.id,
            secretKey: newSecretKey,
            refreshToken: newRefreshToken,
            expiredAt: newExpiredAt,
        }
        const updatedDeviceSession = this.deviceService.updateDeviceSession(updateDeviceSession);
        
        if (updatedDeviceSession) {
            return {token: newToken, refreshToken: newRefreshToken, expiredAt: newExpiredAt};
        }
        return null;
    }

    /**
     * Generate secretKey, each user have unique secretKey.
     * 
     * @param length 
     * @returns 
     */
    generateSecretKey(length = 16) {
        return randomatic('A0', length);
    }

    /**
     * Generate token and save the device information when signing in.
     * 
     * @param userId 
     * @param metaData 
     * @returns 
     */
    async handleDeviceSession(userId: string, metaData: LoginMetaData): Promise<LoginRO> {
        const { deviceId } = metaData;
        const currentDevice = await this.deviceService.getDeviceSession({deviceId});

        const expiredAt = addDay(EXP_SESSION);

        const secretKey = this.generateSecretKey();

        // payload.
        const payload: PayLoad = {
            id: userId,
            deviceId,
        };

        // Generate token.
        const [token, refreshToken] = [this.jwtService.sign(payload, { secret: secretKey }), randomatic('Aa0', 64)];

        // Save information of device which was used by user.
        const newDeviceSession = new DeviceSessionEntity();
        newDeviceSession.user = userId;
        newDeviceSession.secretKey = secretKey;
        newDeviceSession.refreshToken = refreshToken;
        newDeviceSession.expiredAt = expiredAt;
        newDeviceSession.deviceId = deviceId;
        newDeviceSession.ipAddress = metaData.ipAddress;
        newDeviceSession.ua = metaData.ua;
        newDeviceSession.name = metaData.deviceId;
        newDeviceSession.id = currentDevice?.id || randomUUID();

        await this.deviceService.createDeviceSession(newDeviceSession);
        return { token, refreshToken, expiredAt };
    }

    /**
     * Build response object.
     * 
     * @param user 
     * @param token 
     * @returns 
     */
    buildUserAuthRO(user: UserEntity, token: string) {
        const userRO = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image,
            token: token
        };

        return {user: userRO};
    }

    /**
     * Get payload from token.
     * 
     * @param headers 
     * @returns 
     */
    getPayLoad(headers): PayLoad {
        const authHeaders = headers.authorization;
        if (authHeaders && (authHeaders as string).split(' ')[1]) {
            const token = (authHeaders as string).split(' ')[1];
            const decoded: PayLoad = this.jwtService.decode(token);
            return decoded;
        }
        return null;
    }

    /**
     * Base on request header to get secretKey which is used to verify in guard on every request.
     * 
     * @param request 
     * @returns 
     */
    async getSecretKey(payload): Promise<string> {
        if (!payload) {
            return null;
        }

        // Get secretKey from cache
        const { deviceId, id, exp } = payload;
        const keyCache = `sk_${id}_${deviceId}`;
        const secretKeyFromCache = await this.cacheManager.get(keyCache);
        if (typeof secretKeyFromCache === 'string') {
            return secretKeyFromCache;
        }

        // secretKey not exists in cache so get it from database.
        const deviceSession = await this.deviceService.getDeviceSession({userId: id, deviceId});
        if (!deviceSession) {
            return;
        }

        // Update new secretKey to cache which assign to deviceId and id.
        await this.cacheManager.set(keyCache, deviceSession['secretKey'], (exp - Math.floor(Date.now() / 1000)) * 1000);
        return deviceSession['secretKey'];
    }
}
