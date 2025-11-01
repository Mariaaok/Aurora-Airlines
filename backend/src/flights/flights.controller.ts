import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'; 
import { FlightsService } from './flights.service';
import { CreateFlightsDto } from './create-flights.dto'; 
import { UpdateFlightsDto } from './update-flights.dto'; 

@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {} 

  @Get() 
  findAll() {
    return this.flightsService.findAll(); 
  }

  @Post()
  create(@Body() createFlightsDto: CreateFlightsDto) { 
    return this.flightsService.create(createFlightsDto); 
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlightsDto: UpdateFlightsDto) {
    return this.flightsService.update(+id, updateFlightsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}