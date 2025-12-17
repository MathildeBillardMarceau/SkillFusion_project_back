# Erreur de droits lors de la migration prisma





## erreur affichée
Lors de la commande suivante:

```bash
student@teleporter:/var/www/html/SkillFusion/projet-skillfusion-back$ pnpm run db:generate

> projet-skillfusion-back@1.0.0 db:generate /var/www/html/SkillFusion/projet-skillfusion-back
> prisma generate

Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma
Error: 
EACCES: permission denied, unlink '/var/www/html/SkillFusion/projet-skillfusion-back/prisma/generated/prisma/models/Category.ts'


 ELIFECYCLE  Command failed with exit code 1.
```

## vérification

les dossiers internal et models (et/ou leurs sous-dossiers sont devenus propriétés de root au lieu de student)

```bash
student@teleporter:/var/www/html/SkillFusion/projet-skillfusion-back/prisma/generated/prisma$ ll
total 56
drwxrwxr-x 4 student student  4096 déc.  17 15:36 ./
drwxrwxr-x 3 student student  4096 déc.  16 09:56 ../
-rw-rw-r-- 1 student student  1297 déc.  17 15:36 browser.ts
-rw-rw-r-- 1 student student  2170 déc.  17 15:36 client.ts
-rw-rw-r-- 1 student student 21600 déc.  17 15:36 commonInputTypes.ts
-rw-rw-r-- 1 student student   894 déc.  17 15:36 enums.ts
drwxr-xr-x 2 root    root     4096 déc.  16 20:56 internal/
drwxr-xr-x 2 root    root     4096 déc.  16 20:56 models/
-rw-rw-r-- 1 student student   657 déc.  17 15:36 models.ts
```

## solution

```bash
sudo chown -R student:student internal models
```

refaire un ll pour vérifier que student est owner des dossiers

et maintenant la commande devrait bien se terminer


```bash
student@teleporter:/var/www/html/SkillFusion/projet-skillfusion-back$ pnpm run db:generate

> projet-skillfusion-back@1.0.0 db:generate /var/www/html/SkillFusion/projet-skillfusion-back
> prisma generate

Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (7.1.0) to ./prisma/generated/prisma in 155ms
```