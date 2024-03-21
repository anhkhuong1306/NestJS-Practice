import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => (configService.get('database')),
            inject: [ConfigService]
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
}