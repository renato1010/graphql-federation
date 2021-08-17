import { AuthenticationError, UserInputError } from "apollo-server";
import { DataSource } from "apollo-datasource";
import { AppMetadata, ManagementClient, UserMetadata } from "auth0";
import { getToken } from "../../../lib/getToken";

class AccountsDataSource extends DataSource {
  private authorPermissions: string[] = [
    "read:own_account",
    "edit:own_account",
    "read:any_profile",
    "edit:own_profile",
    "read:any_content",
    "edit:own_content",
    "upload:own_media",
  ];
  private moderatorPermissions = [
    "read:any_account",
    "block:any_account",
    "promote:any_account",
    "block:any_content",
  ];
  private auth0: ManagementClient<AppMetadata, UserMetadata>;
  constructor({ auth0 }: { auth0: ManagementClient<AppMetadata, UserMetadata> }) {
    super();
    this.auth0 = auth0;
  }
  createAccount(email: string, password: string) {
    return this.auth0.createUser({
      app_metadata: {
        groups: [],
        roles: ["author"],
        permissions: this.authorPermissions,
      },
      connection: "Username-Password-Authentication",
      email,
      password,
    });
  }
  async changeAccountBlockedStatus(id: string) {
    console.log({ id });
    try {
      const { blocked } = await this.auth0.getUser({ id });
      return this.auth0.updateUser({ id }, { blocked: !blocked });
    } catch (error) {
      throw new AuthenticationError(`Couldn't update user with Id=${id}`);
    }
  }
  async changeAccountModeratorRole(id: string) {
    const user = await this.auth0.getUser({ id });
    const isModerator = (user.app_metadata?.roles as string[])?.includes("moderator") ?? false;
    const roles = isModerator ? ["author"] : ["moderator"];
    const permissions = isModerator
      ? this.authorPermissions
      : [...this.authorPermissions, ...this.moderatorPermissions];
    return this.auth0.updateUser({ id }, { app_metadata: { groups: [], roles, permissions } });
  }
  async updateAccount(
    id: string,
    {
      email,
      newPassword,
      password,
    }: { email: string | undefined; newPassword: string | undefined; password: string | undefined }
  ) {
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
        const user = await this.auth0.getUser({ id });
        if (!user?.email) {
          throw new Error("Couldn't validate user");
        }
        const accessToken = await getToken(user.email, password);
        if (!accessToken) {
          throw new Error("Couldn't validate user");
        }
        return this.auth0.updateUser({ id }, { password: newPassword });
      } catch (error) {
        throw new Error("Could");
      }
    } else {
      // user wants to update email
      return this.auth0.updateUser({ id }, { email });
    }
  }
  async deleteAccount(id: string) {
    const { user_id } = await this.auth0.getUser({ id });
    try {
      // check if id belongs to a user
      await this.auth0.getUser({ id });
      await this.auth0.deleteUser({ id });
      return true;
    } catch (error) {
      return false;
    }
  }
  getAccountById(id: string) {
    return this.auth0.getUser({ id });
  }
  getAccounts() {
    return this.auth0.getUsers();
  }
}

export { AccountsDataSource };
