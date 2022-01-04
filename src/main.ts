import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AtGuard } from 'dn-api-core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

declare const module: any;

const PORT = process.env.PORT || 8300;
const ENVIRONMENT = process.env.MS_APP_ENVIRONTMENT || 'LOCAL';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const reflector = new Reflector();
  const atGuard: any = new AtGuard(reflector);
  app.useGlobalGuards(atGuard);
  const documentBuilder = new DocumentBuilder()
    .setTitle('User app')
    .setDescription('User app description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth();

  if (ENVIRONMENT !== 'LOCAL') {
    const ENDPOINT = process.env.MS_APP_ENDPOINT || 'http://localhost';
    documentBuilder.addServer(ENDPOINT);
  }

  const config = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
