import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class EcurieService {
  constructor(private readonly prisma: PrismaService) {}

  // Crée ou met à jour une écurie à partir des infos OpenF1 du pilote
  async upsert(driver: any) {
    return this.prisma.ecurie.upsert({
      where: { idApiEcurie: driver.team_name },
      update: {
        name: driver.team_name,
        logo: '', // Ajouter si tu récupères un logo
        color: driver.team_colour,
      },
      create: {
        idApiEcurie: driver.team_name,
        name: driver.team_name,
        logo: '',
        color: driver.team_colour,
      },
    });
  }
}
