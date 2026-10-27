import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv); // для поддержки интерполяции

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
