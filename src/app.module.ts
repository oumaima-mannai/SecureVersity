import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TemplatesModule } from './modules/templates/templates.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    UsersModule, 
    AuthModule, TemplatesModule, AssessmentsModule, ResponsesModule, NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
