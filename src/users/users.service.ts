import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface User{
    id: string;
    name: string;
    email: string;
}

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);  

        const newUser = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                role: createUserDto.role,
            }
        });
    }
        async findAll() {
            return this.prisma.user.findMany();
        }
    
        async findOne(id: string) {
            const user = await this.prisma.user.findUnique({ 
                where: { id },
                omit: {password: true} 
            });
            if (!user) throw new NotFoundException(`Usuário com id ${id} não encontrado`);
            return user;
  }
    
    }


