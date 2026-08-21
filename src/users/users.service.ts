import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { createHash } from 'crypto';
import { USER_REPOSITORY } from './repositories/user-repository.interface';
import type { IUserRepository } from './repositories/user-repository.interface';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      });
      return newUser;
  }
  async findAll() {
    return this.userRepository.findAllWithoutPassword();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return user;
  }
  async update(id: string, { password, ...dto }: UpdateUserDTO) {
    await this.findOne(id);

    if (
      dto.name === undefined &&
      dto.email === undefined &&
      password === undefined &&
      dto.role === undefined
    ) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar.',
      );
    }

    if (dto.email !== undefined) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email já cadastrado.');
      }
    }

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    return this.userRepository.update(id, {
      ...dto,
      ...(passwordHash !== undefined && { password: passwordHash }),
    });
  }
}
