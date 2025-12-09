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
    
    description: String  
    image:       String  
    level:       Level     
    duration:    String  
    cost:        String  
    material:    String  
    publishedAt: String

    user:        User

    categories:  [Category!]

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }

  # ===========================
  # Category
  # ===========================
  type Category {
    id:          UUID! 
    name:        String!
    description: String
    icon:        String
    color:       String

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

    categories: [Category!]!
  }
  # ===========================
  # Inputs
  # ===========================
  input CreateCategoryInput {
    name:        String!
    description: String
    icon:        String
    color:       String
  }

  input CreateCourseInput {
    title:       String!
    slug:        String!
    
    description: String  
    image:       String  
    level:       Level     
    duration:    String  
    cost:        String  
    material:    String  
    publishedAt: String

    userId:      UUID!    # lien avec le user créateur
    categoriesId:[UUID!]  # lien avec les catégories
  }

  # ===========================
  # Mutations
  # ===========================
  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    createCourse(input: CreateCourseInput!): Course!
  }
`;
