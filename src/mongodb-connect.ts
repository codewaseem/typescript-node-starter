import mongoose from "mongoose";

const DATABASE_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "TodoApp";

mongoose.Promise = global.Promise;
mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// .then((client) => {
//   let todoDB = client.db(DATABASE_NAME);
//   console.log(`MongoDB Connected`);
//   client.close();
// })
// .catch(() => {
//   console.log(`Failed to connect`);
//   console.log(`Make sure mongodb (mongod) server is running`);
// });
