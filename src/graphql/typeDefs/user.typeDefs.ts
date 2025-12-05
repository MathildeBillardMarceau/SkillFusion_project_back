export const userTypeDefs = `#graphql
  type User {
    id:           String!
    email:        String!
    password:     String!
  }

  type Query {
    users: [User!]!
    user(id: String!): User!
  }
`;
