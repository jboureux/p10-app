import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PiloteEcurie } from './pilote-ecurie.entity';

@ObjectType()
export class Pilote {
  @Field(() => ID)
  id_api_pilote: string; 

  @Field()
  name: string;

  @Field()
  picture: string; 

  @Field()
  name_acronym: string;

  @Field(() => [PiloteEcurie])
  pilote_ecurie?: PiloteEcurie[];
}
