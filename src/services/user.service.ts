import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: Partial<User>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, userData: Partial<User>): Promise<UserEntity> {
    await this.userRepository.update(id, userData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
