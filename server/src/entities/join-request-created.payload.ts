import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class JoinRequestCreatedPayload {
  @Field()
  leagueId: string;

  @Field()
  message: string;
}
