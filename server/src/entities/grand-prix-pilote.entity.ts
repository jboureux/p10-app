import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Ecurie } from './ecurie.entity';
import { GrandPrixClassement } from './grand-prix-classement.entity';
import { GrandPrix } from './grand-prix.entity';
import { Pilote } from './pilote.entity';

@ObjectType()
export class GrandPrixPilote {
  @Field(() => ID, { name: 'id_api_grand_prix_pilote' })
  idApiGrandPrixPilote: string;

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
