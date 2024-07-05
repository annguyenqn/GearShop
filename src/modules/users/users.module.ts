import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config';
import { PropertiesService } from '../properties/properties.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    PropertiesService,
    AuthService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
