import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => (configService.get('database')),
            inject: [ConfigService]
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
}