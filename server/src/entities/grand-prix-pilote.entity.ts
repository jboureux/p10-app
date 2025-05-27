import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Ecurie } from './ecurie.entity';
import { GrandPrixClassement } from './grand-prix-classement.entity';
import { GrandPrix } from './grand-prix.entity';
import { Pilote } from './pilote.entity';

@ObjectType()
export class GrandPrixPilote {
  @Field(() => ID, { name: 'id' })
  id: string;

  @Field(() => GrandPrix, { nullable: true, name: 'grand_prix' })
  grandPrix: GrandPrix;

  @Field(() => Pilote, { nullable: true, name: 'pilote' })
  pilote: Pilote;

  @Field(() => Ecurie, { nullable: true, name: 'ecurie' })
  ecurie: Ecurie;

  @Field(() => [GrandPrixClassement], {
    nullable: true,
    name: 'grand_prix_classement',
  })
  grandPrixClassement?: GrandPrixClassement[];
}
