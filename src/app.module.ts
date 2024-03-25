import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthGuard } from './auth/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './auth/auth.middleware';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    DeviceModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService, 
    AuthService, 
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/refresh-token', method: RequestMethod.POST }  
      )
      .forRoutes(AuthController, UserController)
  }
}