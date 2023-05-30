import { join } from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { OssMiddleware } from 'Oss/middleware/oss.middleware';
import { OssModule } from 'Oss/oss.module';
import { ModelDerivativeModule } from 'ModelDerivative/model-derivative.module';
import { AuthAutodeskModule } from 'AuthAutodesk/auth-autodesk.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { PropertiesModule } from './properties/properties.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.ENVIRONMENT}:${process.env.PORT_DB}/${process.env.MONGO_INITDB_DATABASE}`,
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    OssModule,
    ModelDerivativeModule,
    AuthAutodeskModule,
    ProjectsModule,
    ItemsModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OssMiddleware)
      .forRoutes(
        'api/forge/oss/*',
        'api/forge/modelderivative/*',
        '/api/project/*',
        '/api/items/*',
      );
  }
}
