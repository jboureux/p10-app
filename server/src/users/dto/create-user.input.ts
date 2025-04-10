import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User email' })
  email: string;

  @Field(() => String, { description: 'User first name' })
  firstname: string;

  @Field(() => String, { description: 'User last name' })
  lastname: string;

  @Field(() => String, { description: 'User password' })
  password: string;

  @Field(() => String, { description: 'User role' })
  role: string;
}
