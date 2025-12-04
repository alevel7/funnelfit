import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  if (process.argv.includes('--worker')) {
    // Start only the Bull worker
    const app = await NestFactory.createApplicationContext(AppModule);
    await app.init();
    console.log('NestJS Worker started.');
  } else {
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        // skipMissingProperties: true,
      }),
    );

    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('Median')
      .setDescription('The Median API description')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(
      session({
        secret: process.env.SECRET, // use a strong secret in production!
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production' ? true : false,
        }, // set to true if using HTTPS
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT ?? 3000);

  }
}
bootstrap();
