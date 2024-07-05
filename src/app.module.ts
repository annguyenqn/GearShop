import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guard/accessToken.guard';
import { MailModule } from './modules/mail/mail.module';
import { accessToken } from './common/middleware/accessToken.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { PropertiesModule } from './modules/properties/properties.module';
import { RolesGuard } from './modules/auth/guard/role.guard';
import { multiTenant } from './common/middleware/multiTenant.middleware';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    JwtModule,
    UsersModule,
    MailModule,
    PropertiesModule,
    FirebaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'an_nguyen',
      password: process.env.DB_PASSWORD || '123456a@',
      database: process.env.DB_NAME || 'gear_shop',
      entities: [User],
      synchronize: true, // Chỉ sử dụng synchronize trong môi trường phát triển
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(accessToken)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'mail/send-otp', method: RequestMethod.POST },
        { path: 'mail/sign-up', method: RequestMethod.POST },
      )
      .forRoutes('*');

    consumer
      .apply(multiTenant)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'mail/send-otp', method: RequestMethod.POST },
        { path: 'mail/sign-up', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
