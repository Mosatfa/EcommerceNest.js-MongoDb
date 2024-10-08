import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('PORT')
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Enables automatic transformation
    whitelist: true,  // Strips properties that are not in the DT
  }));
  // Apply global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(port);
}
bootstrap();
