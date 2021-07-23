import { rule, shield, and, or } from "graphql-shield";
import { getPermissions } from "../../lib/getPermissions";

const canReadAnyAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("read:any_account") ?? false;
});
const canReadOwnAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("read:own_account") ?? false;
});
const canEditOwnAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("edit:own_account") ?? false;
});
const canBlockAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("block:any_account") ?? false;
});
const canPromoteAccount = rule()((_parent, _args, { user }, _info) => {
  const userPermissions = getPermissions(user);
  return userPermissions?.includes("promote:any_account") ?? false;
});
const isReadingOwnAccount = rule()((_parent, { id }, { user }, _info) => {
  return user.sub === id;
});
const isEditingOwnAccount = rule()((_parent, { where: { id } }, { user }, _info) => {
  return user.sub === id;
});

export const permissions = shield(
  {
    Query: {
      account: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
      accounts: canReadAnyAccount,
    },
    Mutation: {
      changeAccountBlockedStatus: canBlockAccount,
      changeAccountModeratorRole: canPromoteAccount,
      deleteAccount: and(canEditOwnAccount, isEditingOwnAccount),
      updateAccount: and(canEditOwnAccount, isEditingOwnAccount),
    },
  },
  { debug: process.env.NODE_ENV === "development" }
);
