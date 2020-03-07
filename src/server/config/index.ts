require("dotenv").config();

module.exports = {
  development: {
    username: "devuser",
    password: "Test1234%",
    database: "fs_dev_db",
    database_url: "",
  },
  production: {
    host: process.env.HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    database_url: process.env.DB_URL,
  },
};
