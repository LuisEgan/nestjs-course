import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFIlterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFIlterDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(`User ${user.username} retrieving all tasks.\n
    Filters: ${JSON.stringify(filterDto)}
    `);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  // @Delete('/:id')
  // deleteTask(@Param('id') id: string, @GetUser() user: User): boolean {
  //   return this.tasksService.deleteTask({ id, userId: user.id });
  // }

  //   @Patch('/:id')
  //   updateTask(@Param('id') id: string, @Body() updateTask: Partial<Task>): Task {
  //     return this.tasksService.updateTask({ id, updateTask });
  //   }

  //   @Patch('/:id/status')
  //   updateTaskStatus(
  //     @Param('id') id: string,
  //     @Body('status', TaskStatusValidation) status: TaskStatus,
  //   ): Task {
  //     return this.tasksService.updateTaskStatus({ id, status });
  //   }
}
