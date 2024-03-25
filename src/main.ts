import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
const Fingerprint = require('express-fingerprint');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {abortOnError: false});
  const configService = app.get(ConfigService);

  app.use(
    Fingerprint({
      parameters: [
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip,
      ],
    })
  )
  await app.listen(configService.get<string>('port') || 3000);
}
bootstrap();
