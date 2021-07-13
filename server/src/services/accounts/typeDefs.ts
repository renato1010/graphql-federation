import { gql } from "apollo-server";

export const typeDefs = gql`
  extend type Query {
    hello: String
  }
`;
