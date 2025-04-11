import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GrandPrix } from './grand-prix.entity';
import { Pilote } from './pilote.entity';
import { Ecurie } from './ecurie.entity';
import { GrandPrixClassement } from './grand-prix-classement.entity';

@ObjectType()
export class GrandPrixPilote {
  @Field(() => ID)
  id: string;

  @Field(() => GrandPrix)
  grand_prix: GrandPrix;

  @Field(() => Pilote)
  pilote: Pilote;

  @Field(() => Ecurie)
  ecurie: Ecurie;

  @Field(() => [GrandPrixClassement], { nullable: 'itemsAndList' })
  GrandPrixClassement?: GrandPrixClassement[];
}
