import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const Fingerprint = require('express-fingerprint');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {abortOnError: false});
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Real world API')
    .setDescription('The real world API description')
    .setVersion('1.0')
    .addTag('real-world')
    .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
