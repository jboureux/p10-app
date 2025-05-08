import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLeagueInput {
  @Field()
  name: string;

  @Field()
  isPrivate: boolean;

  @Field()
  apiAvatarId: string;
}
