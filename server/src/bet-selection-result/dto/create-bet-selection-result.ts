// src/bets/dto/create-bet-selection-result.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateBetSelectionResultInput {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  grandPrixId: string;

  @Field(() => ID)
  grandPrixPiloteId: string;
}
