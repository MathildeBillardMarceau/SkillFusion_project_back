export const subscriptionTypeDefs = `#graphql

  # ===========================
  # Message
  # ===========================
  type Subscription {
    course:     Course!
    user:       User!
    completion: String! 

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    subscriptions: [Subscription]!
    subscriptionByUser(userId: UUID!):[Subscription]!
    subscriptionByCourse(courseId: UUID!):[Subscription]!

    subscriptionByUserAtCourse(courseId: UUID!, userId:UUID!):[Subscription]!
    subscriptionByUserAtCourseBySlug(userId:UUID!, slug: String!):[Subscription]!

    # on récupère les subscriptions sur la base du UUID du user ou du cours
    # subscriptions: [Subscription]!
    # on peut n'avoir aucune subscription du tout, mais la liste sera forcément une liste
    #
  }

  # ===========================
  # Inputs
  # ===========================

  input CreateUserSubscription {
    course:     UUID!       #id du course auquel on subscribe
    user:       UUID!       #id du user
    completion: String!     #liste des chapitres      
  }

  input UpdateUserSubscription {
    course:     UUID!       #id du course auquel on subscribe
    user:       UUID!       #id du user
    completion: String!     #liste des chapitres  
  }
  # ici tous les champs sont obligatoires lors de l'update pour s'assurer qu'on est sur la bonne subscription, même si seul completion sera modifié

  # pas de UpdateCourseSubscription car on gère les inscriptions des users, pas les inscriptions depuis les cours
  # toutefois la structure permert de mettre en place l'evolution si la fonctionnalité s'avérait demandée


  # ===========================
  # Mutations
  # ===========================

  type Mutation{
    createUserSubscription(input: CreateUserSubscription!): Subscription!
    updateUserSubscription(input: UpdateUserSubscription!): Subscription!
    deleteUserSubscription(userId: UUID!, courseId: UUID!):Boolean!
      #pour ce delete j'ai besoin des userId et des courseId puisque la table de liaison n'a pas de PK
  }
`;
