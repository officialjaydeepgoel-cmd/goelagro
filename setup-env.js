const fs = require('fs');
const env = `DATABASE_URL="postgresql://neondb_owner:npg_EQ2J5SvRfaoF@ep-flat-pond-aj8hjsks-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
JWT_SECRET=buddyverse-super-secret-jwt-key-2026
JWT_REFRESH_SECRET=buddyverse-super-secret-refresh-key-2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://buddy-verse-6sqjnn65a-officialjaydeepgoel-cmds-projects.vercel.app
NEXT_PUBLIC_APP_NAME=BuddyVerse
`;
fs.writeFileSync('.env', env);
console.log('.env file created');
