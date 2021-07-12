import { server, app } from "./config";

const port = process.env.PORT;

server.applyMiddleware({ app });

app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
