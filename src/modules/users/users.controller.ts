import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel, Role } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '../../guards/auth.guards';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(
    @Body() body: { first_name: string; last_name: string; email?: string; role?: Role },
  ): Promise<UserModel> {
    return this.usersService.createUser(body);
  }

  // Захищений роут, доступний тільки для ADMIN
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers(@Req() req: Request): Promise<UserModel[]> {
    const currentUser = req.user as UserModel; // очікуємо, що user додається через guard
    return this.usersService.findAll(currentUser);
  }

  @Get('search')
  async findUserByFullName(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ): Promise<UserModel | null> {
    return this.usersService.findByFullName(first_name, last_name);
  }

  @Post('confirm')
  async confirm(@Query('id') id: string
  ): Promise<UserModel | null> {
    return this.usersService.confirm(id);
  }
}
