require("dotenv").config();

const config = {
  development: {
    username: "devuser",
    password: "Test1234%",
    database_url: "mongodb://localhost:27017/DevDB",
  },
  production: {
    host: process.env.HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database_url: process.env.DB_URL,
  },
  test: {
    host: "localhost",
    username: "test_db_user",
    password: "test_db_pass",
    database_url: "",
  },
};

export default config;
