import { Controller, Get, Query } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { PaginatedApartmentsDto } from './dto/apartment.dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  async findAll(@Query() query: any): Promise<PaginatedApartmentsDto> {
    return this.apartmentsService.findAll(query);
  }
}
