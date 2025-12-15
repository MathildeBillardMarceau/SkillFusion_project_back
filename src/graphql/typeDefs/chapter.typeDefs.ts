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
    # chaptersByCourse(id: UUID!): [Chapter!]
    # chaptersByUser(id: UUID!): [Chapter!]

    # chaptersByCourseSlug(slug: String!): [Chapter!]
  }

  # ===========================
  # Inputs
  # ===========================

  # input CreateChapter {
  #   content:    String!
  #   userId:       UUID!
  #   courseId:     UUID!
  # }

  #   input UpdateChapter {
  #   content:    String!
  # }

  # ===========================
  # Mutations
  # ===========================

  # type Mutation {
  #   createChapter(input: CreateChapter!): Chapter!
  #   updateChapter(id:UUID!, input:UpdateChapter!): Chapter!
  #   deleteChapter(id:UUID!): Boolean!
  # }
`;
