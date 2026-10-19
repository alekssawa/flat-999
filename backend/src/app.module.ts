import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApartmentsModule } from './apartments/apartments.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    ApartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
