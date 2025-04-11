import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PiloteEcurie } from './pilote-ecurie.entity';

@ObjectType()
export class Ecurie {
  @Field(() => ID)
  idApiEcurie: string;

  @Field()
  name: string;

  @Field()
  logo: string;

  @Field()
  color: string;

  @Field(() => [PiloteEcurie])
  piloteEcurie?: PiloteEcurie[];
}
