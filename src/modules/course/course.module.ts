import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseRepo } from './course.repo';
import { Course, CourseSchema } from './course.schema';
import { CourseService } from './course.service';
import { AccessRepo } from './access.repo';
import { AccessService } from './access.service';
import { Access, AccessSchema } from './access.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Access.name, schema: AccessSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepo, AccessRepo, AccessService],
  exports: [CourseService],
})
export class CourseModule {}
