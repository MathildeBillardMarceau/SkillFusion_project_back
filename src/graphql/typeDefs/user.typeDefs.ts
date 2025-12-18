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
    # subscriptions - représente les cours SUIVIS par le user
    subscriptions:  [Subscription!]

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }
  type AuthPayload {
    user: User!
    accessToken: String!
  }

  # ===========================
  # Subscribed
  # ===========================
  type Subscription {
    course:     Course!
    completion: Int!  
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    # users
    users: [User!]!
    userById(id: UUID!): User!

    #subscriptions
    subscriptionByUser(userId: UUID!)[Subscription!]
    # cette query va aller chercher pour le user (sur base de son UUID)les relations subscription correspondantes
    # pas de ! final car peut être vide (aucune subscription)
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

  input CreateUserSubscription {
    course:     UUID!       #id du course auquel on subscribe
    completion: int!
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

    createUserSubscription(input: CreateUserSubscription!): Subscription!
    deleteUserSubscription(userId: UUID!, courseId: UUID!):Boolean!
      #pour ce delete j'ai besoin des userId et des courseId puisque la table de liaison n'a pas de PK
  }
`;
