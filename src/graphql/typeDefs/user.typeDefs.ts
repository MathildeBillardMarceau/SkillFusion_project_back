export const userTypeDefs = `#graphql

  # ===========================
  # ENUMS
  # ===========================
  enum Role {
    APPRENTICE
    INSTRUCTOR
    ADMIN
  }
  enum Status {
    PENDING 
    APPROVED 
    BANNED
  }

  # ===========================
  # User
  # ===========================
  type User {
    id:          UUID! 
    email:       String!
    password:    String!
    
    firstName:   String!
    lastName:    String!
    
    role:        Role!  
    status:      Status!  

    courses:     [Course!]

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    users: [User!]!
    userById(id: UUID!): User!
  }
`;
