import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBetSelectionResultInput {
  @Field(() => ID)
  userId: string;

  @Field()
  pointP10: number;
}
