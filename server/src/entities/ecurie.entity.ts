import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PiloteEcurie } from './pilote-ecurie.entity';

@ObjectType()
export class Ecurie {
  @Field(() => ID, { name: 'id_api_ecurie' })
  idApiEcurie: string;

  @Field(() => String, { name: 'name' })
  name: string;

  @Field(() => String, { name: 'logo' })
  logo: string;

  @Field(() => String, { name: 'color' })
  color: string;

  @Field(() => [PiloteEcurie], { nullable: true, name: 'pilote_ecurie' })
  piloteEcurie?: PiloteEcurie[];
}
