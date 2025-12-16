export const chapterTypeDefs = `#graphql

  # ===========================
  # Chapter
  # ===========================
  type Chapter {
    id:           UUID!
    title:        String!
    description:  String
    text:         String

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }


  # ===========================
  # Queries
  # ===========================

  type Query {
    chapters: [Chapter!]!
  }

`;
