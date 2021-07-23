import { User, AppMetadata, UserMetadata } from "auth0";
import { CustomAppMetadata } from "./types/accounts";

export const getPermissions = (user: User<AppMetadata, UserMetadata> & Record<string, any>) => {
  if (user?.["https://devchirps.com/user_authorization"]) {
    return (user["https://devchirps.com/user_authorization"] as CustomAppMetadata).permissions;
  }
  return null;
};
