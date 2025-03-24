import { mergeTypeDefs } from '@graphql-tools/merge';
import { userTypeDefs } from './types/user.graphql.js';

export const typeDefs = mergeTypeDefs([userTypeDefs]);
