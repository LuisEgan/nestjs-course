import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './create-student.input';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    const student = this.studentRepository.create({ ...createStudentInput });
    student.id = uuid();

    return this.studentRepository.save(student);
  }

  async student(id: string): Promise<Student> {
    return this.studentRepository.findOne({ id });
  }

  async students(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async getManyStudents(ids: string[]): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        id: {
          $in: ids,
        },
      },
    });
  }
}
