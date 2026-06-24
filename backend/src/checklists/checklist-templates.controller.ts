// src/checklists/checklist-templates.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChecklistTemplatesService } from './checklist-templates.service';
import { CreateChecklistTemplateDto } from './dto/create-checklist-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Domaine } from '../common/enums/domaine.enum';

@Controller('checklist-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChecklistTemplatesController {
  constructor(private readonly service: ChecklistTemplatesService) {}

  // POST /api/checklist-templates
  @Post()
  @Roles(Role.ADMIN_HSEE)
  create(@Body() dto: CreateChecklistTemplateDto) {
    return this.service.create(dto);
  }

  // GET /api/checklist-templates
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET /api/checklist-templates/by-domaine/:domaine  ← binôme l'appellera ici
  @Get('by-domaine/:domaine')
  findByDomaine(@Param('domaine') domaine: Domaine) {
    return this.service.findActiveByDomaine(domaine);
  }

  // GET /api/checklist-templates/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // PUT /api/checklist-templates/:id
  @Put(':id')
  @Roles(Role.ADMIN_HSEE)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateChecklistTemplateDto>,
  ) {
    return this.service.update(id, dto);
  }

  // DELETE /api/checklist-templates/:id
  @Delete(':id')
  @Roles(Role.ADMIN_HSEE)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // POST /api/checklist-templates/import  ← import depuis Excel
  @Post('import')
  @Roles(Role.ADMIN_HSEE)
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('domaine') domaine: Domaine,
    @Body('titre') titre: string,
    @Body('cotationType') cotationType: string,
  ) {
    return this.service.importFromExcel(
      domaine,
      titre,
      cotationType,
      file.buffer,
    );
  }
}
