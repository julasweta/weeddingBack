import {
  Injectable,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(data: {
    first_name: string;
    last_name: string;
    email?: string;
    role?: Role;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          role: data.role || Role.GUEST,
          email: data.email || '',
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Користувач з такою електронною адресою вже існує',
        );
      }

      // Інші неочікувані помилки
      throw new InternalServerErrorException('Помилка при створенні користувача');
    }
  }

  async findByFullName(
    first_name: string,
    last_name: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        first_name,
        last_name,
      },
    });
  }

  async confirm(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new ForbiddenException('Користувача не знайдено');
    }

    if (user.isConfirmed === false) {
      await this.prisma.user.update({
        where: { id: Number(id) },
        data: { isConfirmed: true },
      });
    }

    return user;
  }

  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Доступ заборонено');
    }

    return this.prisma.user.findMany();
  }
}
