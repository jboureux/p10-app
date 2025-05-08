import { InputType, Field, ID } from '@nestjs/graphql';
import { JoinRequestStatus } from '../../entities/join-request.entity';

@InputType()
export class UpdateJoinRequestStatusInput {
  @Field(() => ID)
  requestId: string;

  @Field(() => JoinRequestStatus)
  status: JoinRequestStatus;
}