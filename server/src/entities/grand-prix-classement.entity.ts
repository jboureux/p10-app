import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GrandPrixPilote } from './grand-prix-pilote.entity';
import { GrandPrix } from './grand-prix.entity';

@ObjectType()
export class GrandPrixClassement {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { name: 'position', nullable: true })
  position: number;

  @Field(() => Boolean, { name: 'is_dnf', nullable: true })
  isDnf: boolean;

  @Field(() => Boolean, { name: 'is_first_dnf', nullable: true })
  isFirstDnf: boolean;

  @Field(() => GrandPrix, { nullable: true, name: 'grand_prix' })
  grandPrix: GrandPrix;

  @Field(() => GrandPrixPilote, {
    nullable: true,
    name: 'grand_prix_pilote',
  })
  grandPrixPilote: GrandPrixPilote;
}
