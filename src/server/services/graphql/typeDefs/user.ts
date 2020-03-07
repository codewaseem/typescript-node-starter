import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    user: User
  }

  type User {
    id: ID!
    name: String!
    username: String!
  }
`;
