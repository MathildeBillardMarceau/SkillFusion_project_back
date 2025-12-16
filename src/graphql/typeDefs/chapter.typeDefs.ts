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

  # ===========================
  # Input
  # ===========================

  input UpdateChapter {
    text: String! 
  }


  # ===========================
  # Mutations
  # ===========================

  type Mutation {
    updateChapter(id:UUID!, input:UpdateChapter!): Chapter!
  }
`;
