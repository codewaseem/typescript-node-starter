import app from "./app";

export function startServer(port: number = 3000, host: string = "localhost") {
  return new Promise((resolve) => {
    app.listen(port, host, () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    });
  });
}
