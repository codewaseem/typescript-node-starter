import { startServer, addMiddlewares, connectToDB } from "./setup";

(async function main() {
  await connectToDB();
  await addMiddlewares();
  await startServer();
})();
