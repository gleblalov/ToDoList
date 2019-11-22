import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { TodoController } from './todo/todo.controller';

import { AppService } from './app.service';
import { TodoService } from './todo/todo.service';


import { Tasks, } from './entities';
import { AuthModule } from './auth/auth/auth.module';

 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://gleb:301195@clustertodo-f8edg.mongodb.net/tasks',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forFeature([Tasks]),
    MulterModule.register({
      dest: 'uploads/',
    }),
    AuthModule,
  ],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService],
})
export class AppModule {}
