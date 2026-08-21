import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './repositories/user-repository';
import { USER_REPOSITORY } from './repositories/user-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UsersService, {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    }
  ]
})
export class UsersModule {}
