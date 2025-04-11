import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Pilote } from './pilote.entity';
import { Ecurie } from './ecurie.entity';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class PiloteEcurie {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  year: Date;

  @Field(() => Pilote)
  pilote: Pilote;

  @Field(() => Ecurie)
  ecurie: Ecurie;
}
