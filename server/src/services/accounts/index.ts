import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { applyMiddleware } from "graphql-middleware";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import { permissions } from "./permissions";

// top level await ???

(async () => {
  const port = process.env.ACCOUNTS_SERVICE_PORT;
  const schema = applyMiddleware(buildFederatedSchema([{ typeDefs, resolvers }]), permissions);
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user as string) : null;
      return { user };
    },
  });
  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);
})();
