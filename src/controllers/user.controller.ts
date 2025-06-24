import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { User } from '../interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<UserEntity> {
    return await this.userService.create(userData);
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return await this.userService.findById(id);
  }

  @Get('username/:username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserEntity> {
    return await this.userService.findByUsername(username);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserEntity> {
    return await this.userService.findByEmail(email);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<User>,
  ): Promise<UserEntity> {
    return await this.userService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}
