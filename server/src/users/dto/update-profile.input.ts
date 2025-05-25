import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  firstname?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, {
    message: 'Le mot de passe actuel doit contenir au moins 6 caractères',
  })
  currentPassword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, {
    message: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
  })
  newPassword?: string;
}
