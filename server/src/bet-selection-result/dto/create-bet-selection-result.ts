// src/bets/dto/create-bet-selection-result.input.ts
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBetSelectionResultInput {
  @Field(() => ID)
  grandPrixId: string;

  @Field(() => ID)
  grandPrixPiloteIdP10: string;

  @Field(() => ID)
  grandPrixPiloteIdDNF: string;
}
