import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BetSelectionResult } from './bets-selection-result.entity';
import { UserLeague } from './user-league.entity';

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

  @Field(() => [BetSelectionResult], {
    nullable: true,
    name: 'bet_selection_result',
  })
  BetSelectionResult?: BetSelectionResult[];
}
