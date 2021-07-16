import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";

const gateway = new ApolloGateway({
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
  gateway,
  subscriptions: false,
  context: ({ req }: { req: Record<string, any> }) => {
    const user = req.user || null;
    return { user };
  },
});
