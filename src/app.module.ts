import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentModule } from './payment/payment.module';
import { GroupModule } from './group/group.module';
import { MulterController, PrismaModule } from './tools';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    StudentModule,
    TeacherModule,
    AttendanceModule,
    PaymentModule,
    GroupModule,
  ],
  controllers: [MulterController],
})
export class AppModule {}
