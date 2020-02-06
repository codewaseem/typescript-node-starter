import { MongoClient } from "mongodb";

const DATABASE_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "TodoApp";

const mongoClient = new MongoClient(DATABASE_URL, {
  useUnifiedTopology: true,
});

mongoClient
  .connect()
  .then((client) => {
    let todoDB = client.db(DATABASE_NAME);
    console.log(`MongoDB Connected`);
    client.close();
  })
  .catch(() => {
    console.log(`Failed to connect`);
    console.log(`Make sure mongodb (mongod) server is running`);
  });
