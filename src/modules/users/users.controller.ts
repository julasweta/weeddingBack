import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel, Role } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '../../guards/auth.guards';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from '../types/iUser';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('create')
  async createUser(@Body() body: CreateUserDto): Promise<IUser> {
    return this.usersService.createUser(body.first_name, body.last_name);
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
    console.log(`Searching controller : ${first_name} and last name: ${last_name}`);
    return this.usersService.findByFullName(first_name, last_name);
  }

  @Post('confirm')
  async confirm(@Query('id') id: string
  ): Promise<UserModel | null> {
    return this.usersService.confirm(id);
  }
}
