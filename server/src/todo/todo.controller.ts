import { Controller, Get, Post, Body,Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectID } from 'typeorm';

import { TodoService } from './todo.service';
import { Task, } from '../model';


@Controller('todo')
export class TodoController {

  constructor(private todoService: TodoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTasks(@Req() req) {
    return await this.todoService.getTasks(req.user.id);
  }  

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addTask(@Body() task: Task) {
    return this.todoService.addTask(task);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteTask(@Param('id') id: ObjectID) {
    return this.todoService.deleteTask(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async changeTask(@Param('id') id: ObjectID, @Body() task: Task) {
    console.log('changeTask');
    return await this.todoService.changeTask(id, task);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('synchronize')
  async synchronizeTask(@Body() tasks: Task, @Req() req) {
    return this.todoService.synchronizeTask(req.user.id, tasks);
  }

}


