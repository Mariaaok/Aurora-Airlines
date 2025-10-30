import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'; 
import { AirportsService } from './airports.service';
import { CreateAirportsDto } from './create-airports.dto'; 
import { UpdateAirportsDto } from './update-airports.dto'; 

@Controller('airports')
export class AirportsController {
  constructor(private AirportsService: AirportsService) {} 

  // GET /airports
  @Get() 
  findAll() {
    return this.AirportsService.findAll(); 
  }

  // POST /airports
  @Post()
  create(@Body() CreateAirportsDto: CreateAirportsDto) { 
    return this.AirportsService.create(CreateAirportsDto); 
  }
  
  // GET /airports/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.AirportsService.findOne(+id); 
  }

  // PATCH /airports/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAirportsDto: UpdateAirportsDto) {
    // O método PATCH é usado para atualizações parciais
    return this.AirportsService.update(+id, updateAirportsDto);
  }

  // DELETE /airports/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.AirportsService.remove(+id);
  }
}