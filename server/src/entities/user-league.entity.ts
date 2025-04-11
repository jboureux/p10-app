import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { League } from './league.entity';

@ObjectType()
export class UserLeague {
  @Field(() => ID)
  id: string;

  @Field()
  is_admin: boolean;

  @Field()
  role: string;

  @Field(() => User)
  user: User;

  @Field(() => League)
  league: League;
}
