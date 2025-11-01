import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'; 
import { FlightTypesService } from './flight-types.services';
import { CreateFlightTypesDto } from './create-flight-types.dto'; 
import { UpdateFlightTypesDto } from './update-flight-types.dto'; 

@Controller('flight-types')
export class FlightTypesController {
  constructor(private flightTypesService: FlightTypesService) {} 

  @Get() 
  findAll() {
    return this.flightTypesService.findAll(); 
  }

  @Post()
  create(@Body() createFlightTypesDto: CreateFlightTypesDto) { 
    return this.flightTypesService.create(createFlightTypesDto); 
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightTypesService.findOne(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlightTypesDto: UpdateFlightTypesDto) {
    return this.flightTypesService.update(+id, updateFlightTypesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightTypesService.remove(+id);
  }
}