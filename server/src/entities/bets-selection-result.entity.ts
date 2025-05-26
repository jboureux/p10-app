import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { GrandPrix } from './grand-prix.entity';
import { GrandPrixPilote } from './grand-prix-pilote.entity';

@ObjectType()
export class BetSelectionResult {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  pointP10: number;

  @Field(() => User)
  user: User;

  @Field(() => GrandPrix, { name: 'grand_prix' })
  grandPrix: GrandPrix;

  @Field(() => GrandPrixPilote, { name: 'grand_prix_pilote' })
  grandPrixPilote: GrandPrixPilote;
}
