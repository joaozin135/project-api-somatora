import { User } from "src/generated/prisma/browser";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type UserPublic = Omit<User, 'password'>;
export type UserWithPassword = User;

export interface IUserRepository {
  create(input: CreateUserDTO): Promise<UserPublic>;
  findById(id:string): Promise<UserPublic | null>;
  findByEmail(email:string): Promise<UserWithPassword | null>;
  findAllWithoutPassword(): Promise<UserPublic[]>;
  update(id: string, input: UpdateUserDTO): Promise<UserPublic>;
  remove(id: string): Promise<void>;
}   