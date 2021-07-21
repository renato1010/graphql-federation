import { ManagementClient } from "auth0";

if (
  !process.env.AUTH0_DOMAIN ||
  !process.env.AUTH0_CLIENT_ID_MGMT_API ||
  !process.env.AUTH0_CLIENT_SECRET_MGMT_API
) {
  throw new Error("Error loading en vars for Auth0 Mng Client");
}

export const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID_MGMT_API,
  clientSecret: process.env.AUTH0_CLIENT_SECRET_MGMT_API,
});
