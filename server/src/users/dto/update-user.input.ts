import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String, { description: 'User ID' })
  id: string;

  @Field(() => String, { description: 'User email', nullable: true })
  email: string;

  @Field(() => String, { description: 'User first name', nullable: true })
  firstname: string;

  @Field(() => String, { description: 'User last name', nullable: true })
  lastname: string;

  @Field(() => String, { description: 'User role', nullable: true })
  role: string;
}
