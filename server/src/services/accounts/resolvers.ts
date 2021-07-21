import { GraphQLResolverMap } from "apollo-graphql";
import { User, AppMetadata, UserMetadata } from "auth0";
import { auth0 } from "../../config";

export const resolvers: GraphQLResolverMap<any> = {
  Account: {
    __resolveReference(reference: { id: string }, context: any, info: any) {
      return auth0.getUser({ id: reference.id });
    },
    id: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      context: Record<string, any>,
      info: any
    ) => {
      return account.user_id!;
    },
    createdAt: (
      account: User<AppMetadata, UserMetadata>,
      args: Record<string, any>,
      context: Record<string, any>,
      info: any
    ) => account.created_at!,
  },
  Query: {
    account: (parent: undefined, args: Record<string, any>, context: any, info: any) => {
      return auth0.getUser({ id: args.id });
    },
    accounts: (parent: undefined, args: Record<string, any>, context: any, info: any) => {
      return auth0.getUsers();
    },
    viewer: (
      parent: undefined,
      args: Record<string, any>,
      { user }: { user: Record<string, any> },
      info: any
    ) => {
      if (user?.sub ?? undefined) {
        return auth0.getUser({ id: user.sub });
      }
      return null;
    },
  },
};
