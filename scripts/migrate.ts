
import { exec } from 'child_process';

async function runMigration() {
  console.log('Running Prisma migration...');
  
  exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Migration completed: ${stdout}`);
  });
}

runMigration();
