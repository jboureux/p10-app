import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserLeague } from './user-league.entity';
import { BetSelectionResult } from './bets-selection-result.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstname?: string;

  @Field()
  lastname?: string;

  @Field()
  role: string;

  @Field()
  api_avatar_id?: string;

  @Field(() => [UserLeague])
  user_league?: UserLeague[];

  @Field(() => [BetSelectionResult])
  bets_selection_results?: BetSelectionResult[];
}
