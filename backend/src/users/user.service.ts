import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds)

    const userToSave = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = this.usersRepository.create(userToSave); 
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
      // 2. Usa o método 'findOneBy' do TypeORM
      // É assíncrono, então usamos 'await'
      const user = await this.usersRepository.findOneBy({
        email: email, // Busca onde a coluna 'email' bate com o argumento 'email'
      });

      return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

}
