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
    publishedAt: DateTime

    user:        User

    categories:  [Category!]
    chapters:    [Chapter!]

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
    # courses
    courses: [Course!]!
    courseById(id: UUID!): Course!
    courseBySlug(slug: String!): Course!

    # categories
    categories: [Category!]!
    categoryById(id: UUID!): Category!
    categoryByName(name: String!): Category!

    # levels
    levels: [Level!]!
  }
  # ===========================
  # Inputs
  # ===========================
  # Categories
  input CreateCategoryInput {
    name:        String!
    description: String
    icon:        String
    color:       String
  }
  input UpdateCategoryInput {
    name:        String
    description: String
    icon:        String
    color:       String
  }

  # Chapters
  input CreateChapterInput {
    title:       String!
    description: String
    text:        String
  }

  # Courses
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
    chapters:    [CreateChapterInput!]
  }
  
  input UpdateCourseInput {
    title:       String
    slug:        String
    
    description: String  
    image:       String  
    level:       Level     
    duration:    String  
    cost:        String  
    material:    String  
    publishedAt: String

    categoriesId:[UUID!]  # pour mettre à jour les catégories
  }

  # ===========================
  # Mutations
  # ===========================
  type Mutation {
    # category
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: UUID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: UUID!): Boolean!

    # course
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: UUID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: UUID!): Boolean!
  }
`;
