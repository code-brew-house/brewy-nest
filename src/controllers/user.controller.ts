import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserEntity } from '../entities/user.entity';
import { User } from '../interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async authenticatedUser(@Request() req): Promise<UserEntity> {
    // For now, we'll use a simple approach. In a real app, you'd use JWT or session auth
    // This assumes the user is authenticated and user info is in req.user
    return req.user;
  }

  @Get()
  async allUsers(): Promise<UserEntity[]> {
    return await this.userService.allUsers();
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<UserEntity> {
    return await this.userService.create(userData);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return await this.userService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserEntity> {
    return await this.userService.findByEmail(email);
  }

  @Get('username/:username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserEntity> {
    return await this.userService.findByUsername(username);
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
