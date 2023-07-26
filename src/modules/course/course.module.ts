import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseRepo } from './course.repo';
import { Course, CourseSchema } from './course.schema';
import { CourseService } from './course.service';
import { AccessRepo } from './access.repo';
import { AccessService } from './access.service';
import { Access, AccessSchema } from './access.schema';
import { VideoModule } from '../video/video.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Access.name, schema: AccessSchema }]),
    VideoModule,
    forwardRef(() => UserModule),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepo, AccessRepo, AccessService],
  exports: [CourseService, AccessService],
})
export class CourseModule {}
