// src/join-request/entities/join-request.entity.ts
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { League } from './league.entity';

export enum JoinRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
}

registerEnumType(JoinRequestStatus, {
  name: 'JoinRequestStatus',
});

@ObjectType()
export class JoinRequest {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => League)
  league: League;

  @Field(() => JoinRequestStatus)
  status: JoinRequestStatus;

  @Field()
  createdAt: Date;
}
