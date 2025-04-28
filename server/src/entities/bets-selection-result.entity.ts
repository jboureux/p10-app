import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { GrandPrix } from './grand-prix.entity';
import { GrandPrixPilote } from './grand-prix-pilote.entity';

@ObjectType()
export class BetsSelectionResult {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  pointP10: number;

  @Field(() => User)
  user: User;

  @Field(() => GrandPrix)
  grand_prix: GrandPrix;

  @Field(() => GrandPrixPilote)
  grand_prix_pilote: GrandPrixPilote;
}
