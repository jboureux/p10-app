import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Track } from './track.entity';
import { BetSelectionResult } from './bets-selection-result.entity';

@ObjectType()
export class GrandPrix {
  @Field(() => String, {
    name: 'id_api_races',
    description: 'ID get with API Races',
  })
  idApiRaces: string;

  @Field(() => String, { description: 'Grand Prix Season' })
  season: string;

  @Field(() => String, { description: 'Grand Prix date' })
  date: Date;

  @Field(() => String, { description: 'Grand Prix Date' })
  time: Date;

  @Field(() => [Track])
  track: [Track];

  @Field(() => BetSelectionResult)
  bets_selection_result?: BetSelectionResult[];
}
