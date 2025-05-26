import { Field, ObjectType } from '@nestjs/graphql';
import { GrandPrixClassement } from './grand-prix-classement.entity';
import { Track } from './track.entity';
import { BetSelectionResult } from './bets-selection-result.entity';

@ObjectType()
export class GrandPrix {
  @Field(() => String, {
    description: 'ID get with API Races',
    name: 'id_api_races',
  })
  idApiRaces: string;

  @Field(() => String, { description: 'Grand Prix Season' })
  season: string;

  @Field(() => Date, { description: 'Grand Prix date' })
  date: Date;

  @Field(() => Date, { description: 'Grand Prix time' })
  time: Date;

  @Field(() => Track, { nullable: true })
  track: Track;

  @Field(() => [GrandPrixClassement], {
    nullable: true,
    name: 'grand_prix_classement',
  })
  grandPrixClassement?: GrandPrixClassement[];

  @Field(() => BetSelectionResult)
  bets_selection_result?: BetSelectionResult[];
}
