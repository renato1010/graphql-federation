import { connect, connection } from "mongoose";

export const dbConnection = () => {
  const connectionUrl = process.env.MONGODB_URL;

  if (!connectionUrl) {
    throw new Error("Problem connecting database");
  }

  connect(connectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  connection.on("connected", () => {
    console.log(`Mongoose default connection ready at ${connectionUrl}`);
  });
  connection.on("error", (error) => {
    console.log("Mongoose default connection error: ", error);
  });
};
