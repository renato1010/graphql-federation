import { Request } from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";

const gateway: any = new ApolloGateway({
  serviceList: [{ name: "accounts", url: process.env.ACCOUNTS_SERVICE_URL }],
  buildService: ({ url }) => {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context: { user } }) {
        request.http?.headers?.set("user", user ? JSON.stringify(user) : "");
      },
    });
  },
});
export const server = new ApolloServer({
  gateway: gateway,
  context: ({ req }: { req: Request & { user: Record<string, any> } }) => {
    const user = req?.user ?? null;
    return { user };
  },
  subscriptions: false,
});
