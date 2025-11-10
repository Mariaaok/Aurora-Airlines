import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common'; 
import { FlightsService } from './flights.service';
import { CreateFlightsDto } from './create-flights.dto'; 
import { UpdateFlightsDto } from './update-flights.dto'; 
import { FlightSearchDto } from './flight-search.dto'; 

@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {} 

  @Get() 
  findAll() {
    return this.flightsService.findAll(); 
  }

  @Post('search')
  search(@Body() searchDto: FlightSearchDto) {
    return this.flightsService.searchFlights(searchDto);
  }

  @Post()
  create(@Body() createFlightsDto: CreateFlightsDto) { 
    return this.flightsService.create(createFlightsDto); 
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findOne(id); 
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFlightsDto: UpdateFlightsDto) {
    return this.flightsService.update(id, updateFlightsDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.remove(id);
  }
}