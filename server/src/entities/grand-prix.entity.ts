import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserLeague } from './user-league.entity';
import { BetsSelectionResult } from './bets-selection-result.entity';
import { Track } from './track.entity';

@ObjectType()
export class GrandPrix {
  @Field(() => Int, { description: 'ID get with API Races' })
  id_api_races: string;

  @Field(() => String, { description: 'Grand Prix Season' })
  season: string;

  @Field(() => String, { description: 'Grand Prix date' })
  date: Date;

  @Field(() => String, { description: 'Grand Prix Date' })
  time: Date;

  @Field(() => String, { description: 'ID get with Api Tracks' })
  id_api_tracks: string;

  @Field(() => [UserLeague])
  user_league?: UserLeague[];

  @Field(() => [BetsSelectionResult])
  bets_selection_result?: [BetsSelectionResult];

  @Field(() => [Track])
  track?: [Track];
}
