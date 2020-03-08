import { startServer, setupGraphQL, connectToDB } from "./setup";

(async function main() {
  await connectToDB();
  await setupGraphQL();
  await startServer();
})();
