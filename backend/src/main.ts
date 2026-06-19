import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { seedAdmin } from './seed/admin.seed';
import { DataSource } from 'typeorm/data-source/index.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
    app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
   // Récupérer la DataSource TypeORM
  // const dataSource = app.get(DataSource);

  // // Exécuter le seed
  // await seedAdmin(dataSource);


  await app.listen(3000);
  console.log('Backend running on http://localhost:3000/api');

}
bootstrap();
