export const messageTypeDefs = `#graphql

  # ===========================
  # Message
  # ===========================
  type Message {
    id:         UUID!
    content:    String!

    user:       User!
    course:     Course!

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }

  # ===========================
  # Queries
  # ===========================

  type Query {
    messages: [Message!]!
    messagesByCourse(id: UUID!): [Message!]
    messagesByUser(id: UUID!): [Message!]
    # ajout de recherche des cours par slug pour chaque cours plutôt que UUID
    # la suite dans le resolver
    messagesByCourseSlug(slug: String!): [Message!]
  }

  # ===========================
  # Inputs
  # ===========================

  input CreateMessage {
    content:    String!
    userId:       UUID!
    courseId:     UUID!
  }

    input UpdateMessage {
    content:    String!
  }

  # ===========================
  # Mutations
  # ===========================

  type Mutation {
    createMessage(input: CreateMessage!): Message!
    updateMessage(id:UUID!, input:UpdateMessage!): Message!
    deleteMessage(id:UUID!): Boolean!
  }
`;
