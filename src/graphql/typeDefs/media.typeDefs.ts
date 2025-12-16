export const mediaTypeDefs = `#graphql

  # ===========================
  # ENUMS
  # ===========================
  enum MediaType {
    IMAGE
    VIDEO
  }

  # ===========================
  # Media
  # ===========================
  type Media {
    id:          UUID!
    url:         String!
    type:        MediaType!

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }


  # ===========================
  # Queries
  # ===========================
  type Query {
    medias: [Media!]!
  }

  # ===========================
  # Inputs
  # ===========================
  input CreateMediaInput {
    url:  String!
    type: MediaType!
  }

`;
