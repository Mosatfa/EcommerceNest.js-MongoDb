import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';

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


  // somewhere in your initialization file
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: connectMongo.create({
        mongoUrl: configService.get<string>('MONGO_URI'),
        collectionName: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      },
    }),
  );

  app.use((req: any, res: any, next: any) => {
    if (!req.session.cartId) {
      req.session.cartId = uuidv4(); // Assign a stable cart UUID for the session
    }
    next();
  });

  await app.listen(port);
}
bootstrap();
