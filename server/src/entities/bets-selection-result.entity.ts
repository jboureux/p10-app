import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { GrandPrix } from './grand-prix.entity';

@ObjectType()
export class BetsSelectionResult {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  pointP10: number;

  @Field(() => Int)
  idPiloteP10: number;

  @Field(() => User)
  user: User;

  @Field(() => GrandPrix)
  grandPrix: GrandPrix;
}
