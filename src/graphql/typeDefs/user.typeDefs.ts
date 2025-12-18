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
    # password:    String!
    
    firstName:   String!
    lastName:    String!
    avatar:      String
    
    role:        Role!  
    status:      Status!  

    # courses - représente les cours CREES par le user
    courses:        [Course!]

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }
  type AuthPayload {
    user: User!
    accessToken: String!
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    # users
    users: [User!]!
    userById(id: UUID!): User!
  }

  # ===========================
  # Inputs
  # ===========================
  input CreateUserInput {
    email:      EmailAddress!
    password:   String!
    firstName:  String!
    lastName:   String!
  }
  input LoginUserInput {
    email:      EmailAddress!
    password:   String!
  }
  input UpdateUserInput {
    email:      EmailAddress
    password:   String
    firstName:  String
    lastName:   String
    role:       Role
  }


  # ===========================
  # Mutations
  # ===========================
  type Mutation{
    registerUser(input: CreateUserInput): User!
    loginUser(input: LoginUserInput): AuthPayload!
    updateUser(id: UUID!, input: UpdateUserInput): User!
    deleteUser(id: UUID!): Boolean!

    refreshToken(refreshToken: String!): AuthPayload!
  }
`;
