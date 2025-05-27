import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserLeague } from './user-league.entity';

@ObjectType()
export class League {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  sharedLink: string;

  @Field()
  isPrivate: boolean;

  @Field()
  isActive: boolean;

  @Field()
  apiAvatarId: string;

  @Field(() => [UserLeague], { name: 'user_league' })
  userLeague?: UserLeague[];
}
