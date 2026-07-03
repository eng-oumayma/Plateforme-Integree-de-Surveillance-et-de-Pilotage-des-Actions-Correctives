import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RegulatoryEventsService } from './regulatory-events.service';
import { CreateRegulatoryEventDto } from './dto/create-regulatory-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('regulatory-events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegulatoryEventsController {
  constructor(private readonly service: RegulatoryEventsService) {}

  @Post()
  @Roles('ADMIN_HSEE') // Seul l'admin planifie
  create(@Body() dto: CreateRegulatoryEventDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN_HSEE')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}