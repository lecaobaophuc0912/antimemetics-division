import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './config/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: 'user',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      todos: [],
      refreshTokens: [],
    },
  ];

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    return await this.userRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      return false;
    }
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
