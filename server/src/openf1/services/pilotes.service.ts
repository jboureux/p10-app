import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PiloteService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(driver: any) {
    const picture =
      driver.headshot_url ||
      'https://media.formula1.com/d_driver_fallback_image.png';
    const name = driver.full_name?.trim() ?? 'Unknown Driver';
    const acronym = driver.name_acronym?.toUpperCase()?.trim() ?? 'UNK';
    const id = driver.driver_number?.toString();

    if (!id) {
      console.warn(`❌ Numéro de pilote manquant pour le driver:`, driver);
      return null;
    }

    return this.prisma.pilote.upsert({
      where: { idApiPilote: id },
      update: {
        name,
        picture,
        nameAcronym: acronym,
      },
      create: {
        idApiPilote: id,
        name,
        picture,
        nameAcronym: acronym,
      },
    });
  }
}
