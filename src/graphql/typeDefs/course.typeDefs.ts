export const courseTypeDefs = `#graphql
  type Course {
    id:           Int! # on peut définir des champs non-nuls
    title:        String!
    createdAt:    String!
  }

  type Query {
    courses: [Course!]! # en typescrit on aurait fait Course[]
    course(id: Int!): Course!
  }
`;
