import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PiloteEcurie } from './pilote-ecurie.entity';

@ObjectType()
export class Pilote {
  @Field(() => ID, { name: 'id_api_pilote' })
  idApiPilote: string;

  @Field(() => String, { name: 'name' })
  name: string;

  @Field(() => String, { name: 'picture' })
  picture: string;

  @Field(() => String, { name: 'name_acronym' })
  nameAcronym: string;

  @Field(() => [PiloteEcurie], { nullable: true, name: 'pilote_ecurie' })
  pilotesEcurie?: PiloteEcurie[];
}
