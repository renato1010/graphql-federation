import { GraphQLResolverMap } from "apollo-graphql";
import { UserInputError } from "apollo-server";
import { User, AppMetadata, UserMetadata } from "auth0";
import { auth0 } from "../../config";
import { getToken } from "../../lib/getToken";
import { UpdateAccountInput } from "../../lib/types";
import { DateTimeResolver } from "../../lib/customScalars";

export const resolvers: GraphQLResolverMap<any> = {
  DateTime: DateTimeResolver,
  Account: {
    __resolveReference(reference: { id: string }, _context: any, _info: any) {
      return auth0.getUser({ id: reference.id });
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
    account: (_parent: undefined, args: Record<string, any>, _context: any, _info: any) => {
      const { id } = args as Record<string, string>;
      return auth0.getUser({ id });
    },
    accounts: (_parent: undefined, args: Record<string, any>, _context: any, _info: any) => {
      return auth0.getUsers();
    },
    viewer: (
      _parent: undefined,
      args: Record<string, any>,
      { user }: { user: Record<string, any> },
      _info: any
    ) => {
      if (user?.sub) {
        return auth0.getUser({ id: user.sub });
      }
      return null;
    },
  },
  Mutation: {
    createAccount: (_parent: undefined, args: Record<string, any>, _context: any, _info: any) => {
      const {
        data: { email, password },
      } = args as { data: { email: string; password: string } };
      return auth0.createUser({
        app_metadata: {
          groups: [],
          roles: ["author"],
          permissions: [
            "read:own_account",
            "edit:own_account",
            "read:any_profile",
            "edit:own_profile",
            "read:any_content",
            "edit:own_content",
            "upload:own_media",
          ],
        },
        connection: "Username-Password-Authentication",
        email,
        password,
      });
    },
    updateAccount: async (_parent: undefined, args: Record<string, any>, _context: any, _info: any) => {
      const {
        data: { email, newPassword, password },
        where: { id },
      } = args as { data: UpdateAccountInput; where: { id: string } };
      if (!email && !newPassword && !password) {
        throw new UserInputError("You must supply some account data to update");
      } else if (email && newPassword && password) {
        throw new UserInputError("Email and Passoword cannot be updated simultaneously");
        // password and newPassowrd must be submitted together
      } else if ((!password && newPassword) || (password && !newPassword)) {
        throw new UserInputError("Provide the existing and new passwords when updating password");
      } else if (!email && password && newPassword) {
        // if no email user wants to update password
        try {
          const user = await auth0.getUser({ id });
          if (!user?.email) {
            throw new Error("Couldn't validate user");
          }
          const accessToken = await getToken(user.email, password);
          if (!accessToken) {
            throw new Error("Couldn't validate user");
          }
          return auth0.updateUser({ id }, { password: newPassword });
        } catch (error) {
          throw new Error("Could");
        }
      } else {
        // user wants to update email
        return auth0.updateUser({ id }, { email });
      }
    },
    deleteAccount: async (_parent: undefined, args: Record<string, any>, _context: any, _info: any) => {
      const {
        where: { id },
      } = args as { where: { id: string } };
      try {
        // check if id belongs to a user
        await auth0.getUser({ id });
        await auth0.deleteUser({ id });
        return true;
      } catch (error) {
        return false;
      }
    },
    changeAccountModeratorRole: async (
      _parent: undefined,
      args: Record<string, any>,
      _context: any,
      _info: any
    ) => {
      const {
        where: { id },
      } = args as { where: { id: string } };

      const authorPermissions = [
        "read:own_account",
        "edit:own_account",
        "read:any_profile",
        "edit:own_profile",
        "read:any_content",
        "edit:own_content",
        "upload:own_media",
      ];

      const moderatorPermissions = [
        "read:any_account",
        "block:any_account",
        "promote:any_account",
        "block:any_content",
      ];
      const user = await auth0.getUser({ id });
      const isModerator = (user.app_metadata?.roles as string[])?.includes("moderator") ?? false;
      const roles = isModerator ? ["author"] : ["moderator"];
      const permissions = isModerator ? authorPermissions : [...authorPermissions, ...moderatorPermissions];
      return auth0.updateUser({ id }, { app_metadata: { groups: [], roles, permissions } });
    },
    changeAccountBlockedStatus: async (
      _parent: undefined,
      args: Record<string, any>,
      _context: any,
      _info: any
    ) => {
      const {
        where: { id },
      } = args as { where: { id: string } };
      const { blocked } = await auth0.getUser({ id });
      return auth0.updateUser({ id }, { blocked: !Boolean(blocked) });
    },
  },
};
