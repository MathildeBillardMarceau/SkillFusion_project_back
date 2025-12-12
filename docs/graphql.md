# GraphQL comment ça marche


## Les typeDefs

### le fichier index.ts

importe les types définis dans les autres fichiers de l'ensemble et les regroupe dans une grosse variable utilisable par graphQl

### un fichier type (ex: message.typeDefs.ts)

Le fichier est structuré en 4 parties

#### type Message

Role: définir la **structure des données d'un message**
Ici c'est le mirroir du modèle prisma, mais je peux aussi choisir de ne pas montrer tous les champs (par exemple cacher le password)

```ts
  type Message {
    id:         UUID!
    content:    String!

    user:       User!
    course:     Course!

    createdAt:   DateTime!
    updatedAt:   DateTime!
  }
```

On peut définir plusieurs types dans un même fichier, ce qui servira si on veut les joindre dans certains requêtes et les utiliser comme types de retour ou relations dans d'autres types..

#### type Query

Role: définir toutes les **requêtes possibles** pour récupérer les types définis au-dessus (ici messages). C'est l'équivalent du GET en REST

On a des requêtes paramétrées

```ts
  type Query {
    messages: [Message!]!
    messagesByCourse(id: UUID!): [Message!]
    messagesByUser(id: UUID!): [Message!]
  }
```
**Explication de la syntaxe:**
```ts
    messages: [Message!]!
```
Quand dans mon resolver je vais faire une query nommés **messages** elle va me retourner une liste de données correspondant à mon **type Message**
Le ! dans `[Message!]`signifie que chaque élément de la liste est un message non-null
Le ! après`[Message!]!`signifie que la liste ne peut pas être nulle (même vide ce sera une liste)

```ts
  messagesByCourse(id: UUID!): [Message!]
```
Quand dans mon resolver je vais faire une query nommés **messagesByCourse** je dois impérativement avoir un argument `id` au format `UUID`


#### input CreateMessage & input UpdateMessage

Role: définir les **données nécéssaires** pour **créer** et **mettre à jour** un message.
Create indique tous les champs obliatoire
Update indique les champs optionnels (ici il y a quand même une obligation)

_Il n'est pas nécéssaire de faire d'input pour les suppressions_

```ts
  input CreateMessage {
    content:    String!
    userId:       UUID!
    courseId:     UUID!
  }

  input UpdateMessage {
    content:    String!
  }
```

#### type Mutation

Role: définir toutes les **opérations qui modifient les données**

```ts
  type Mutation {
    createMessage(input: CreateMessage!): Message!
    updateMessage(id:UUID!, input:UpdateMessage!): Message!
    deleteMessage(id:UUID!): Boolean!
  }
```
**Explication de la syntaxe:**
`(input: CreateMessage!)` indique qu'on doit envoyer un argument input qui correspond au `input CreateMessage` défini dans la partie précédent.
Le `!` indique que cet argument est obligatoire.
Le retour sera toujours un message jamais null (on aura une erreur si null)

Même logique ici, 
`updateMessage(id:UUID!, input:UpdateMessage!): Message!`
sauf qu'on doit passer deux arguments:
`id:UUID!` un id de type UUID
`input:UpdateMessage!` un input de type UpdateMessage


### Les types scalaires scalar.typeDefs.ts

Les scalaires sont des types de base qui représentent des valeurs simples.
GraphQL fournit 5 scalaires par défaut `Int` `Float` `String` `Boolean` `ID`

On peut aussi importer des scalaires supplémenaires depuis une librairie
Par exemple dans notre package.json on a importé `"graphql-scalars": "^1.25.0"`

On a ensuite importé certains de ces scalaires et on les a exportés en tant que scalarTypDefs et on les importés dans index.ts (pour y concaténer toute la grosse fonction GraphQL)

```ts
import {
	DateTimeTypeDefinition,
	EmailAddressTypeDefinition,
	UUIDDefinition,
} from "graphql-scalars";

export const scalarTypeDefs = [
	DateTimeTypeDefinition,
	EmailAddressTypeDefinition,
	UUIDDefinition,
];
```

Ici on a importe DateTime, Email et UUID

## Les résolvers