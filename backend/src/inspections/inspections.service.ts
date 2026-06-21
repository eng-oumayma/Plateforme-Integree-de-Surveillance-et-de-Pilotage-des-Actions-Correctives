// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateInspectionDto } from './dto/create-inspection.dto';
// import { Domaine } from '../common/enums/domaine.enum';

// @Injectable()
// export class InspectionsService {
//   constructor(private prisma: PrismaService) {}

//   // ── Résoudre le template checklist selon le domaine ───────────────────────
//   private async resolveChecklist(domaine: Domaine): Promise<string | null> {
//     const template = await this.prisma.checklistTemplate.findUnique({
//       where: { domaine },
//     });
//     return template?.id ?? null;
//   }

//   // ── Créer une inspection ──────────────────────────────────────────────────
//   async create(dto: CreateInspectionDto, auditeurId: string) {
//     const checklistId = await this.resolveChecklist(dto.domaine);

//     const inspection = await this.prisma.inspection.create({
//       data: {
//         domaine:    dto.domaine,
//         site:       dto.site,
//         datePrevue: new Date(dto.datePrevue),
//         latitude:   dto.latitude  ?? null,
//         longitude:  dto.longitude ?? null,
//         timestamp:  new Date(),   // horodatage serveur — non falsifiable
//         auditeurId,
//         checklistId,
//         statut: 'EN_COURS',
//       },
//       include: {
//         auditeur:  { select: { id: true, firstName: true, lastName: true, email: true } },
//         checklist: { select: { id: true, titre: true, domaine: true } },
//       },
//     });

//     return inspection;
//   }

//   // ── Lister les inspections (filtrées selon le rôle) ──────────────────────
//   async findAll(options: {
//     auditeurId?: string;
//     domaine?: Domaine;
//     site?: string;
//     statut?: string;
//     dateFrom?: string;
//     dateTo?: string;
//   }) {
//     const where: any = {};
//     if (options.auditeurId) where.auditeurId = options.auditeurId;
//     if (options.domaine)    where.domaine    = options.domaine;
//     if (options.site)       where.site       = { contains: options.site, mode: 'insensitive' };
//     if (options.statut)     where.statut     = options.statut;
//     if (options.dateFrom || options.dateTo) {
//       where.datePrevue = {};
//       if (options.dateFrom) where.datePrevue.gte = new Date(options.dateFrom);
//       if (options.dateTo)   where.datePrevue.lte = new Date(options.dateTo);
//     }

//     return this.prisma.inspection.findMany({
//       where,
//       orderBy: { datePrevue: 'asc' },
//       include: {
//         auditeur:  { select: { id: true, firstName: true, lastName: true } },
//         checklist: { select: { id: true, titre: true } },
//       },
//     });
//   }

//   // ── Récupérer une inspection par ID ──────────────────────────────────────
//   async findOne(id: string) {
//     const inspection = await this.prisma.inspection.findUnique({
//       where: { id },
//       include: {
//         auditeur:  { select: { id: true, firstName: true, lastName: true, email: true } },
//         checklist: { select: { id: true, titre: true, domaine: true, items: true } },
//       },
//     });
//     if (!inspection) throw new NotFoundException(`Inspection #${id} introuvable`);
//     return inspection;
//   }

//   // ── Mettre à jour le statut ───────────────────────────────────────────────
//   async updateStatut(id: string, statut: string) {
//     return this.prisma.inspection.update({
//       where: { id },
//       data:  { statut: statut as any, ...(statut === 'TERMINEE' ? { dateRealise: new Date() } : {}) },
//     });
//   }
// }
