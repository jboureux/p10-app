import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserLeague } from './user-league.entity';

@ObjectType()
export class League {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  shared_l_link: string;

  @Field()
  is_private: boolean;

  @Field()
  is_active: boolean;

  @Field({ nullable: true })
  api_avata_id?: string;

  @Field(() => [UserLeague])
  user_league?: UserLeague[];
}
