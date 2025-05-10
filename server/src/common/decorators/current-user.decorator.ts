import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserFromJwt } from '../types/user-from-jwt.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserFromJwt => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
