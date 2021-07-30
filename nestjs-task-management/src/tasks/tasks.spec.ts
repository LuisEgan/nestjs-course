import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTasksFIlterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    try {
      const module = await Test.createTestingModule({
        providers: [
          TasksService,
          {
            provide: TaskRepository,
            useFactory: mockTaskRepository,
          },
        ],
      }).compile();

      tasksService = module.get<TasksService>(TasksService);
      taskRepository = module.get<TaskRepository>(TaskRepository);
    } catch (error) {
      console.error('error: ', error);
    }
  });

  describe('getTasks', () => {
    it('gets all task from the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('something');

      const filters: GetTasksFIlterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Query',
      };

      // * call tasksService.getTasks
      const result = await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('something');
    });
  });

  describe('getTasksById', () => {
    it('calls taskRepository.findOne() and retrieves and return the task', async () => {
      const mockTask = {
        title: 'test task',
        description: 'test desc',
      };

      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepo.create() and returns result', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto = { title: 'test task', description: 'desc' };
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual('someTask');
    });
  });
});
