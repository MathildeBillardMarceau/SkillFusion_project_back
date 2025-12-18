export const chapterTypeDefs = `#graphql

  # ===========================
  # Chapter
  # ===========================
  type Chapter {
    id:           UUID!
    title:        String!
    description:  String
    text:         String
    media:        Media

    createdAt:    DateTime!
    updatedAt:    DateTime!
  }


  # ===========================
  # Queries
  # ===========================
  type Query {
    chapters:     [Chapter!]!
  }

  # ===========================
  # Inputs
  # ===========================
  input CreateChapterInput {
    id:           UUID
    title:        String!
    description:  String
    text:         String
    media:        CreateMediaInput
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
