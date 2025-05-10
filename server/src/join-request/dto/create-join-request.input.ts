import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateJoinRequestInput {
  @Field(() => ID)
  leagueId: string;
}
