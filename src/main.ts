import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './confings/swagger-config';
import { UserSchema } from './modules/user/user.schema';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(`mongodb://${process.env.MONGO_HOST}/nest`);

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  configSwagger(app);

  UserSchema.index({ username: 'text', firstname: 'text', lastname: 'text' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
