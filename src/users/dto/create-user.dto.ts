import { IsEmail, IsNotEmpty, Isstring, MinLength } from 'class-validator';

export class CreateUserDTO {
@IsInt({ message: 'Id precisa ser numero' })
id: number;
@IsString({message: })
@MinLength(2)
name!: string;
@IsEmail()
email!: string;
}
