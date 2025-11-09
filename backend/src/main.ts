import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session = require('express-session');
import passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    session({                                                                                                                 
      secret: process.env.SESSION_SECRET || 'STRONG_SESSION_SECRET_CHANGE_IN_PRODUCTION',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.BACKEND_PORT || process.env.PORT || 5000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`Backend is running on ${host}:${port}`);
}

bootstrap();