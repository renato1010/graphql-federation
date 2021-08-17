import { gql } from "apollo-server";

export const typeDefs = gql`
  # SCALARS
  scalar DateTime

  # OBJECTS

  """
  An account is an Auth0 user that provides authentication details
  """
  type Account @key(fields: "id") {
    "The unique Auth0 ID associated with the account."
    id: ID!
    "The email associated with the account(must be unique)"
    email: String
    "The date and time the account was created"
    createdAt: DateTime!
    "Whether the account has a moderator role"
    isModerator: Boolean
    "Whether the account is blocked"
    isBlocked: Boolean
  }

  #INPUTS

  """
  Provides data to create a new account
  """
  input CreateAccountInput {
    "The new account's email (must be unique)"
    email: String!
    "The new account's password"
    password: String!
  }
  """
  Provides the unique ID of an existing account
  """
  input AccountWhereUniqueInput {
    "The unique Auth0 ID associated with the account"
    id: ID!
  }
  """
  Provides data to update an existing account.
  A current password and new password are required to update a password.
  Password and email fields cannot be updated simultaneously.
  """
  input updateAccountInput {
    "The updated account email."
    email: String
    "The updated account password."
    newPassword: String
    "The existing account password."
    password: String
  }
  # QUERIES & MUTATIONS

  extend type Query {
    "Retrieves a single account using Auth0 ID."
    account(id: ID!): Account!
    "Retrieves a list of accounts."
    accounts: [Account]
    "Retrieves the currently logged in account from Auth0."
    viewer: Account
  }

  extend type Mutation {
    "Creates a new account."
    createAccount(data: CreateAccountInput): Account!
    "Updates an account's details."
    updateAccount(data: updateAccountInput!, where: AccountWhereUniqueInput!): Account!
    "Deletes an account."
    deleteAccount(where: AccountWhereUniqueInput!): Boolean!
    "Escalates or deescalates moderator role permissions."
    changeAccountModeratorRole(where: AccountWhereUniqueInput): Account!
    "Blocks or unblocks an account from authenticating."
    changeAccountBlockedStatus(where: AccountWhereUniqueInput): Account!
  }
`;
