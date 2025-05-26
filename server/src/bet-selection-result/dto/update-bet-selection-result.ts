import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBetSelectionResultInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  grandPrixPiloteIdP10: string;

  @Field(() => ID)
  grandPrixPiloteIdDNF: string;
}
