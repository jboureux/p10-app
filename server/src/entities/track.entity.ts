import { Field, ObjectType } from '@nestjs/graphql';
import { GrandPrix } from './grand-prix.entity';

@ObjectType()
export class Track {
  @Field(() => String, {
    description: 'ID get with Api Tracks',
    name: 'id_api_track',
  })
  idApiTrack?: string;

  @Field(() => String, {
    description: 'Name of the country where race is running',
    name: 'country_name',
  })
  countryName?: string;

  @Field(() => String, { description: 'Name of the track', name: 'track_name' })
  trackName?: string;

  @Field(() => String, {
    description: 'Path of the picture country',
    name: 'picture_country',
  })
  pictureCountry?: string;

  @Field(() => String, {
    description: 'Circuit picture of the track',
    name: 'picture_track',
    nullable: true,
  })
  pictureTrack?: string;

  @Field(() => [GrandPrix], { nullable: true })
  grandPrix?: [GrandPrix];
}
