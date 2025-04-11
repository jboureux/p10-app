import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GrandPrix } from './grand-prix.entity';
@ObjectType()
export class Track {
  @Field(() => String, { description: 'ID get with Api Tracks' })
  idApi_tracks: string;
  
  @Field(() => Int, { description: 'Name of the country where race is running' })
  country_name: string;

  @Field(() => String, { description: 'Name of the track' })
  track_name: string;

  @Field(() => String, { description: 'Path of the picture country' })
  picture_countre: Date;

  @Field(() => String, { description: 'Circuit picture of the track' })
  picture_track: Date;

  @Field(() => [GrandPrix])
  grand_prix?: [GrandPrix];

}
