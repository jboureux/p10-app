import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './resolvers/user.resolver.js';

export const resolvers = mergeResolvers([userResolvers]);
