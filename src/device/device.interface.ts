export interface LoginMetaData {
    ipAddress: string;
    ua: string;
    deviceId: string;
}

export interface LoginRO {
    token: string,
    refreshToken: string,
    expiredAt: Date,
}

export interface LogoutRO {
    message: string;
    status: string;
    deviceId: string;
}

export interface DeviceSessionRO {
    id: string;
    deviceId: string;
    name: string;
    ua: string;
    secretKey: string;
    refreshToken: string;
    expiredAt: Date;
    ipAddress: string;
    user: string
}