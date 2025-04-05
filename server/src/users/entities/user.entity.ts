import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'User ID' })
  id: number;

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
