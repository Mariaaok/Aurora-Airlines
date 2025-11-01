import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'; 
import { AircraftTypesService } from './aircraft-types.service';
import { CreateAircraftTypesDto } from './create-aircraft-types.dto'; 
import { UpdateAircraftTypesDto } from './update-aircraft-types.dto'; 

@Controller('aircraft-types')
export class AircraftTypesController {
  constructor(private aircraftTypesService: AircraftTypesService) {} 

  @Get() 
  findAll() {
    return this.aircraftTypesService.findAll(); 
  }

  @Post()
  create(@Body() createAircraftTypesDto: CreateAircraftTypesDto) { 
    return this.aircraftTypesService.create(createAircraftTypesDto); 
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aircraftTypesService.findOne(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAircraftTypesDto: UpdateAircraftTypesDto) {
    return this.aircraftTypesService.update(+id, updateAircraftTypesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftTypesService.remove(+id);
  }
}