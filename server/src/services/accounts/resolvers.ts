import { GraphQLResolverMap } from "apollo-graphql";
import { User, AppMetadata, UserMetadata } from "auth0";
import { UpdateAccountInput } from "../../lib/types";
import { DateTimeResolver } from "../../lib/customScalars";
import { AccountsDataSource } from "./datasources/AccountsDataSource";

export const resolvers: GraphQLResolverMap<any> = {
  DateTime: DateTimeResolver,
  Account: {
    __resolveReference(
      reference: { id: string },
      _args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } }
    ) {
      return dataSources.accountsAPI.getAccountById(reference.id);
    },
    id: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      _context: Record<string, any>,
      _info: any
    ) => {
      return account.user_id!;
    },
    createdAt: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      _context: Record<string, any>,
      _info: any
    ) => account.created_at!,
    isModerator: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      _context: Record<string, any>,
      _info: any
    ) => {
      return (account?.app_metadata?.roles as string[])?.includes("moderator") ?? false;
    },
    isBlocked: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      _context: Record<string, any>,
      _info: any
    ) => account.blocked ?? false,
  },
  Query: {
    account: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const { id } = args as Record<string, string>;
      return dataSources.accountsAPI.getAccountById(id);
    },
    accounts: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      return dataSources.accountsAPI.getAccounts();
    },
    viewer: (
      _parent: undefined,
      args: Record<string, any>,
      { user, dataSources }: { user: Record<string, any>; dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      if (user?.sub ?? null) {
        return dataSources.accountsAPI.getAccountById(user.sub);
      }
      return null;
    },
  },
  Mutation: {
    createAccount: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const {
        data: { email, password },
      } = args as { data: { email: string; password: string } };
      return dataSources.accountsAPI.createAccount(email, password);
    },
    updateAccount: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const {
        data: { email, newPassword, password },
        where: { id },
      } = args as { data: UpdateAccountInput; where: { id: string } };
      return dataSources.accountsAPI.updateAccount(id, { email, newPassword, password });
    },
    deleteAccount: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const {
        where: { id },
      } = args as { where: { id: string } };
      return dataSources.accountsAPI.deleteAccount(id);
    },
    changeAccountModeratorRole: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const {
        where: { id },
      } = args as { where: { id: string } };
      return dataSources.accountsAPI.changeAccountModeratorRole(id);
    },
    changeAccountBlockedStatus: (
      _parent: undefined,
      args: Record<string, any>,
      { dataSources }: { dataSources: { accountsAPI: AccountsDataSource } },
      _info: any
    ) => {
      const {
        where: { id },
      } = args as { where: { id: string } };
      return dataSources.accountsAPI.changeAccountBlockedStatus(id);
    },
  },
};
