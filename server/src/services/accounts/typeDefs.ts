import { gql } from "apollo-server";

export const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    email: String
    createdAt: String!
  }
  extend type Query {
    account(id: ID!): Account!
    accounts: [Account]
    viewer: Account
  }
`;
