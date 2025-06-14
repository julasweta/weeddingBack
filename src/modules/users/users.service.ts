import { Injectable, ForbiddenException } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(data: {
    first_name: string;
    last_name: string;
    email?: string;
    role?: Role;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role || Role.GUEST,
        email: data.email || '', // Якщо email не передано, то буде null
      },
    });
  }

  async findByFullName(first_name: string, last_name: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        first_name,
        last_name,
      },
    });
  }
  

  async confirm(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: Number(id) } });

    if (user && user.isConfirmed === false) {
      await this.prisma.user.update({
        where: { id: Number(id) },
        data: { isConfirmed: true },
      });
    }

    return user;
  }
  
  
  // Приклад авторизації: тільки ADMIN може отримати список юзерів
  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Доступ заборонено');
    }
    return this.prisma.user.findMany();
  }
}
