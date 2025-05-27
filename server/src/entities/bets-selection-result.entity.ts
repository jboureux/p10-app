import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GrandPrixPilote } from './grand-prix-pilote.entity';
import { GrandPrix } from './grand-prix.entity';
import { User } from './user.entity';

@ObjectType()
export class BetSelectionResult {
  @Field(() => ID)
  id: string;

  @Field(() => Int, { name: 'point_p10', nullable: true })
  pointP10: number;

  @Field(() => Int, { name: 'point_dnf', nullable: true })
  pointDnf: number;

  @Field(() => User, { name: 'user' })
  user: User;

  @Field(() => GrandPrix, { name: 'grand_prix', nullable: true })
  grandPrix: GrandPrix;

  @Field(() => GrandPrixPilote, {
    name: 'grand_prix_pilote_p10',
    nullable: true,
  })
  grandPrixPiloteP10: GrandPrixPilote;

  @Field(() => GrandPrixPilote, {
    name: 'grand_prix_pilote_dnf',
    nullable: true,
  })
  grandPrixPiloteDnf: GrandPrixPilote;
}
