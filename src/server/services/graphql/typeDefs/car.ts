import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    car: Car
  }

  type Car {
    id: ID!
    make: String!
    model: String!
    colour: String!
  }
`;
