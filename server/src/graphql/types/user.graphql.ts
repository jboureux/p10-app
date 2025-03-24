import { gql } from 'graphql-tag';

export const userTypeDefs = gql`

  type User {
    id: Int!
    email: String!
    firstname: String!
    lastname: String!
    password: String!
    role: String!
    apiAvatarId: String!
  }

  type UserPublic {
    id: Int!
    email: String!
    firstname: String!
    lastname: String!
    role: String!
    apiAvatarId: String!
  }

  type Query {
    getUsers: [UserPublic!]!
    getUserById(id: Int!): UserPublic
  }

  type Mutation {
    createUser(
      email: String!
      firstname: String!
      lastname: String!
      password: String!
      role: String!
      apiAvatarId: String!
    ): UserPublic!
  }
`;
