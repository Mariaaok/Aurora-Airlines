import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto'; 
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get() 
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) { 
    return this.usersService.create(createUserDto); 
  }
}