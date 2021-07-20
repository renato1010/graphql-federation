import { server, app } from "./config";

const port = process.env.PORT;
(async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port }, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
})();
