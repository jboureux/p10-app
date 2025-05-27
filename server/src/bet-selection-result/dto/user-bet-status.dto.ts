import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserBetStatus {
  @Field(() => Boolean, {
    description: "Indique si l'utilisateur a déjà parié sur ce Grand Prix",
    name: 'has_bet',
  })
  hasBet: boolean;

  @Field(() => ID, {
    nullable: true,
    description: "ID du pari si l'utilisateur a déjà parié",
    name: 'bet_id',
  })
  betId?: string;
}
