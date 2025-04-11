import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GrandPrix } from './grand-prix.entity';
import { GrandPrixPilote } from './grand-prix-pilote.entity';

@ObjectType()
export class GrandPrixClassement {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  position: number;

  @Field(() => GrandPrix)
  grand_prix: GrandPrix;

  @Field(() => GrandPrixPilote)
  grandPrixPilote: GrandPrixPilote;
}
