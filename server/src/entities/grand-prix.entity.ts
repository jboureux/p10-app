import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Track } from './track.entity';
import { BetsSelectionResult } from './bets-selection-result.entity';

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

  @Field(() => [Track])
  track: [Track];

  @Field(() => BetsSelectionResult)
  bets_selection_result?: BetsSelectionResult[];
}
