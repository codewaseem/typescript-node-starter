import mongoose from "mongoose";

export default class DBConnector {
  private dbConnection: mongoose.Mongoose | undefined;

  async start(dbUri: string) {
    this.dbConnection = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    return this.dbConnection.connection;
  }

  async stop() {
    await this.dbConnection?.disconnect();
  }
}
