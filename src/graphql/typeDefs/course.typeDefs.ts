export const courseTypeDefs = `#graphql

  # ===========================
  # ENUMS
  # ===========================
  enum Level {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  # ===========================
  # Course
  # ===========================
  type Course {
    id:          UUID! 
    title:       String!
    slug:        String!
    
    excerpt:     String  
    image:       String  
    level:       Level     
    duration:    String  
    cost:        String  
    material:    String  
    publishedAt: String

    user:        User

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    courses: [Course!]!
    courseById(id: UUID!): Course!
    courseBySlug(slug: String!): Course!
  }
`;
