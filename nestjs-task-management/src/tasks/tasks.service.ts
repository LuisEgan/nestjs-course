import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFIlterDto } from './dto/get-tasks-filter-dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task of id ${id} was not found`);
    }

    return task;
  }

  async createTask(createTask: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTask, user);
  }

  async getTasks(filterDto: GetTasksFIlterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
}
