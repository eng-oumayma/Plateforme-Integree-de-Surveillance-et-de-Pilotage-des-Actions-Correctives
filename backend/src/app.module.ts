import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST'),
  port: parseInt(config.get<string>('DB_PORT') || '5432', 10), //  Conversion propre
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASS'),
  database: config.get<string>('DB_NAME'),
  entities: [User],
  synchronize: true, 
  logging: false,
}),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
