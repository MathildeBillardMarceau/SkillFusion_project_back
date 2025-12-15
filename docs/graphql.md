# GraphQL comment ça marche


## Les typeDefs

Les typeDefs servent à structurer les données

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

**Si je veux utiliser un champ qui n'est pas dans mon type**
```ts
    messagesByCourseSlug:(slug: String!): [Message!]
```
ajout de recherche des cours par slug pour chaque cours plutôt que UUID
=> la suite dans le resolver
 

#### input CreateMessage & input UpdateMessage

Role: définir les **données nécéssaires à retourner** lors de la **création** et **mise à jour** d'un message.

Create indique tous les champs obliatoire
Update indique les champs optionnels (ici il y a quand même une obligation)

_Il n'est pas nécéssaire de faire d'input pour les suppressions_
```ts
  input UpdateMessage {
    content:    String!
  }
```

```ts
  input CreateMessage {
    content:    String!
    userId:       UUID!
    courseId:     UUID!
  }
```

**Attention** sous cette forme avec les `!` obligations **de retour** il va falloir dans la mutation inclure userId et courseId sous la forme 
`include: { user: true, course: true },`
sinon il ne sera pas possible de retourner les champs obtenus après création (même si ce sont les champs qu'on a fournis, ils seront requis à partir du message)

**Il y a deux solutions:**
1°/ rendre les champs optionnels - ce qui permet de garder la destructuration dans la mutation
```ts
  input CreateMessage {
    content:    String!
    userId:       UUID
    courseId:     UUID
  }
```
et `include` signifiant inclure le résultat de ces requêtes dans la réponse
```ts
	createMessage: async (_parent, { input }, { prisma }) => {
			const message = await prisma.message.create({
				data: { ...input }, 
				include: { user: true, course: true }, 
			});
			return message;
		},
```

2°/ ne pas demander du tout les infos dans l'input, il faudra alors les prendre ailleurs (et on ne pourra pas destructurer l'input de la requête)
```ts
  input CreateMessage {
    content:    String!
  }
```

```ts
	createMessage: async (_parent, { input }, { prisma }) => {
			const message = await prisma.message.create({
				  data: {
    				content: input.content,
    				userId: input.userId,
    				courseId: input.courseId,
						},
			});
			return message;
		},
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

Les résolvers exécutent des opérations pour
  - aller rechercher les données, via l'ORM, la DB ou une API
  - transformer ou combiner les données pour les retourner au client

### le fichier index.ts

Importe et concatène tous les resolvers pour les exporter dans une grosse constante `resolvers`

Il se compose de deux parties `Query` et `Mutation`
On peut trouver une 3ème pour des types personnalisés

### un fichier type (ex: messageResolvers.ts)

#### Query

```js
export const messageResolvers = {
	Query: {
```
Une fois l'export structuré, on rentre dans la partue `Query:{}`

Chaque Query comment par un nom qui correspond aux types Query definis dans message.typeDefs.js

**exemple:**
```js
		messages: async (_parent, _args, { prisma }) => {
			return await prisma.message.findMany({
				include: { user: true, course: true },
			});
		},
```

Ici `messages` fait une requête (donc async await)
On doit fournir les champs `_parent, _args,` qui sont vides donc préfixés avec un `_`
On appelle ensuite `{ prisma }`
Pour faire une requête `prisma.message.findMany()`
Et on va spécifier qu'on fourni aussi les éléments joints `include: { user: true, course: true },` qui correspondent aux éléménts définis dans le type Message dans message.typeDefs.js (et correspondent dans prisma aux liaisons entre plusieurs Modèles et donc entre plusieurs tables dans la DB)


```js
		messagesByCourse: async (_parent, args, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: { courseId: args.id },
				include: { user: true },
			});
			return messages;
		},
```
Cet exemple est un peu plus complexe:
`messagesByCourse` fait une requête, mais on aura besoin de `args` qui n'est donc pas préfixé
Dans mon `prisma.message.findMany()` 
- je vais faire un filtre avec `where: { courseId: args.id },`
    Comme je **filtre** je vais utiliser le champ `courseId` de mon modèle prisma qui est le champ physique contenant la clef étrangère dans la DB
    `args` est un objet, donc j'utilise sa valeur id avec `args.id`
- je vais ensuite joindre avec `include: { user: true },`
    Comme je **joins** je vais utiliser le champ `user` de mon modèle prisma qui est la relation virtuelle entre les modèles Message et User

_(voir les notes prisma en cas de doute)_



```js
		messagesByUser: async (__parent, args, { prisma }) => {
			const messages = await prisma.message.findMany({
				where: { userId: args.id },
				include: { course: true },
			});
			// ajout d'un controle d'erreur si rien n'es retourné
      if (!messages) {
				throw new GraphQLError("Message(s) non trouvé(s)", {
					extensions: {
						code: "NOT FOUND",
						http: { status: 404 },
					},
				});
			}
			return messages;
		}
```

Cette fonction est identique à la précédente, mais j'ai rajouté un controle en cas d'absence de résultats.
Ce controle utilise `GraphQLError` une classe de graphQL qui se traduit par un import de `import { GraphQLError } from "graphql";`

Les `extensions` servent à définir des valeurs comme `code` et `http status` pour la machine qui demande la query

#### Mutation

Positionnement des mutations
```ts
export const messageResolvers = {
	Query: {},
  Mutation:{},
}
```

```ts
createMessage: async (_parent, { input }, { prisma }) => {
			const message = await prisma.message.create({
				data: { ...input },
				include: { user: true, course: true }, 
			});
			return message;
		},
```
On va utiliser la mutation `createMessage` qui correspond à l'input `CreateMessage`. On fait la différence entre l'input qui a une Majuscule et le resolver qui a une minuscule

On utilise `{ input }` au lieu de `args` sinon la syntaxe ne change pas

Dans ma requête `prisma.message.create({ data: { ...input },});`
Je fais appel à la **destructuration de l'input** ou **spread opérator**
Les `...` indique que comme les champs définis dans l'input GraphQL et le modèle Prisma, je n'ai pas besoin de les nommer, ils vont se préciser tout seuls

Ici je suis obligé de rajouter `include: { user: true, course: true },` car mon input les attends en champs obligatoires


```ts
		updateMessage: async (_parent, { id, input }, { prisma }) => {
			const message = await prisma.message.update({
				where: { id },
				data: input,
			});
			return message;
		},
```
Ici on note qu'on passe deux arguments `{ id, input }` alors que id n'est pas défini dans mon input
En fait le second champ de la requête correspond à la partie entre parenthèses dans le type Mutation de typeDefs.ts
`updateMessage(id:UUID!, input:UpdateMessage!): Message!`

```ts
		deleteMessage: async (_parent, { id }, { prisma }) => {
			await prisma.message.delete({ where: { id } });
			return true;
		},
```
Finalement le delete est le plus simple, on passe juste l'id comme défini dans le type Mutation
