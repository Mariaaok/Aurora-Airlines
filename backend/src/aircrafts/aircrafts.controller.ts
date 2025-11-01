import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AircraftsService } from './aircrafts.service';
import { CreateAircraftsDto } from './create-aircrafts.dto';
import { UpdateAircraftsDto } from './update-aircrafts.dto';

@Controller('aircrafts')
export class AircraftsController {
  constructor(private aircraftsService: AircraftsService) {}

  @Get()
  findAll() {
    return this.aircraftsService.findAll();
  }

  @Post()
  create(@Body() createAircraftsDto: CreateAircraftsDto) {
    return this.aircraftsService.create(createAircraftsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aircraftsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAircraftsDto: UpdateAircraftsDto) {
    return this.aircraftsService.update(id, updateAircraftsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftsService.remove(id);
  }
}