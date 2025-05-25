import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class GrandPrixService {
  constructor(private readonly prisma: PrismaService) {}

  async exists(meetingKey: number): Promise<boolean> {
    const count = await this.prisma.grandPrix.count({
      where: { idApiRaces: meetingKey.toString() },
    });
    return count > 0;
  }

  async createFromMeeting(meeting: any, trackId: string) {
    return this.prisma.grandPrix.create({
      data: {
        idApiRaces: meeting.meeting_key.toString(),
        season: meeting.year.toString(),
        date: new Date(meeting.date_start),
        time: new Date(meeting.date_start),
        idApiTrack: trackId,
      },
    });
  }
}
