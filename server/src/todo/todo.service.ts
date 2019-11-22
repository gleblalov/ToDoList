import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ObjectID } from 'typeorm';

import { Tasks, } from '../entities';
import { Task, } from '../model';


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
  ) { }

  async getTasks(id): Promise<Tasks[]> {
    return await this.tasksRepository.find({
      where: {
        userID: `${id}`,
      }
    });

  }

  async addTask(task: Task): Promise<Task> {
    return await this.tasksRepository.save(task);
  }

  async deleteTask(id: ObjectID) {
    return await this.tasksRepository.delete(id);
  }

   async changeTask(id: ObjectID, task: Task) {
    return await this.tasksRepository.update(id, task);
  }

  async synchronizeTask(id: ObjectID, tasks: Task): Promise<Task> {
           const findTasks = await this.tasksRepository.find({
              where: {
                userID: `${id}`,
              }
            })
            await this.tasksRepository.remove(findTasks);
    return await this.tasksRepository.save(tasks);
  }
}
