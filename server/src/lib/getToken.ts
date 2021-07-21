import { URLSearchParams } from "url";
import fetch from "node-fetch";

export const getToken = async (username: string, password: string): Promise<string | null> => {
  const params = new URLSearchParams();
  if (
    !process.env.AUTH0_AUDIENCE ||
    !process.env.AUTH0_CLIENT_ID_GRAPHQL ||
    !process.env.AUTH0_CLIENT_SECRET_GRAPHQL ||
    !process.env.AUTH0_DOMAIN
  ) {
    throw new Error("env vars not loaded");
  }
  params.append("audience", process.env.AUTH0_AUDIENCE);
  params.append("client_id", process.env.AUTH0_CLIENT_ID_GRAPHQL);
  params.append("client_secret", process.env.AUTH0_CLIENT_SECRET_GRAPHQL);
  params.append("grant_type", "http://auth0.com/oauth/grant-type/password-realm");
  params.append("realm", "Username-Password-Authentication");
  params.append("scope", "openid");
  params.append("password", password);
  params.append("username", username);
  try {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      body: params,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    const data = await response.json();
    // console.log({ data: data?.access_token ?? "no token" });
    return data?.access_token ?? null;
  } catch (error) {
    throw new Error(error);
  }
};

// (async () => {
//   await getToken("contact@renatoperez.dev", "Contact101010");
// })();
