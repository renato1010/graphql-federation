import { rule, shield, and, or } from "graphql-shield";
import { getPermissions } from "../../lib/getPermissions";

const canReadAnyAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("read:any_account") ?? false;
});

export const permissions = shield(
  {
    Query: {
      accounts: canReadAnyAccount,
    },
  },
  { debug: process.env.NODE_ENV === "development" }
);
