# les modeles prisma(../prisma/schema.prisma)


## configuration des modeles (tables)
  @id précise que c'est la clef primaire

  @default(uuid()) @db.Uuid
    le @db.Uuid sert à préciser à prisma que si on a un string coté prisma, le type coté DB est un UUID
  @unique précise un champ unique
  String? ? précise qu'un champ n'est pas not null

  @@map ("model")      permet de faire correspondre un Model (prisma) avec une table (PostGRE)

## enums
  on crée le enum en-dessous et on ajoute le enum en Type (avec une Majuscule donc)
  impossible d'utiliser les chiffres dans les ENUMS


## les relations dans prisma

### one-to-one (1..1) 


### one-to-many (1..N) - Un cours est écrit par 1 et 1 seul user - un user peut écrire 0 à N cours
#### Dans Course:
    user_id     String    @db.Uuid
    user_id: c'est la valeur du champ qui sera entré dans la colonne user_id table course de la DB
    
    user        User      @relation(fields:[user_id], references: [id])
      user: c'est le champ du modèle
    On explique qu'on va chercher dans le model User sa clef id et qu'on va la mettre dans le champ user_id de course

#### Dans User:
    course      Course[]
    grace à la relation dans Course, pas besoin de préciser de ce coté que course est lié à user (d'ailleurs dans le SQL il n'y a pas de table de liaison entre course et user)
    on va avoir les infos sous forme de tableau du model Course, qui peut être vide, donc pas besoin de préciser le NOT NULL avec un ?

### many-to-many (N..N)

// ===========================
// MODEL : CourseHasSubscriber 
// ===========================

model CourseHasSubscriber{
  
  @@id([courseId, userId])

  //FK
  courseId    String @map("course_id")
  userId      String @map("user_id")
  completion  Int

  // Relations
  course      Course @relation("CourseHasSub", fields: [courseId], references: [id], onDelete: Cascade)
  user        User @relation("SubTakesCourse", fields: [userId], references: [id], onDelete: Cascade)

  @@map("course_has_subscriber")
}


// ===========================
// MODEL : User
// ===========================
  // le user peut s'abonner a plusieur courses
  subrscription  CourseHasSubscriber[] @relation("SubTakesCourse")

// ===========================
// MODEL : Course
// ===========================
  // Relations : un cours peut avoir plusieurs abonnés
  subscription  CourseHasSubscriber[] @relation("CourseHasSub")

### récursive


// ===========================
// MODEL : CoursePrerequisitesCourse 
// ===========================

model CoursePrerequisitesCourse{
  @@id([courseId, prerequisiteId])

  //FK
  courseId        String @map("course_id")
  prerequisiteId  String @map("prerequisite_id")
  
  //Relations (ici on doit préciser quelle relation pour les préciser dans course donc elles sont nommées)
  course        Course @relation("PickedCourse", fields: [courseId], references: [id], onDelete: Cascade)
  prerequisite  Course @relation("PrereqCourse", fields: [prerequisiteId], references: [id], onDelete: Cascade)


@@map("course_prerequisites_course")
}

// ===========================
// MODEL : Course
// ===========================


  // /!\ relation récursive des cours (donc il faut utiliser le nom de la relation car on a référence à la même clef)
  relationPickedCourse      CoursePrerequisitesCourse[] @relation("PickedCourse")
  relationPrereqCourse      CoursePrerequisitesCourse[] @relation("PrereqCourse")