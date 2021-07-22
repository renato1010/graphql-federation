import { gql } from "apollo-server";

export const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    email: String
    createdAt: String!
    isModerator: Boolean
  }
  extend type Query {
    account(id: ID!): Account!
    accounts: [Account]
    viewer: Account
  }
  input CreateAccountInput {
    email: String!
    password: String!
  }
  input AccountWhereUniqueInput {
    id: ID!
  }
  input updateAccountInput {
    email: String
    newPassword: String
    password: String
  }
  extend type Mutation {
    createAccount(data: CreateAccountInput): Account!
    updateAccount(data: updateAccountInput!, where: AccountWhereUniqueInput!): Account!
    deleteAccount(where: AccountWhereUniqueInput!): Boolean!
    changeAccountModeratorRole(where: AccountWhereUniqueInput): Account!
  }
`;
