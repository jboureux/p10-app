import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromMeeting(meeting: any) {
    return this.prisma.track.upsert({
      where: { idApiTrack: meeting.circuit_key.toString() },
      update: {},
      create: {
        idApiTrack: meeting.circuit_key.toString(),
        countryName: meeting.country_name,
        trackName: meeting.circuit_short_name,
        pictureCountry: '', // à compléter si tu as des assets
        pictureTrack: '', // idem
      },
    });
  }
}
