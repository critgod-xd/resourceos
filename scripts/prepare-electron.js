const fs = require('fs-extra');
const path = require('path');

async function main() {
  console.log("Preparing Next.js standalone build for Electron...");

  const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
  const standaloneNextDir = path.join(standaloneDir, '.next');
  
  // 1. Copy public directory
  const publicDir = path.join(__dirname, '..', 'public');
  const standalonePublicDir = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicDir)) {
    console.log("Copying public directory...");
    await fs.copy(publicDir, standalonePublicDir);
  }

  // 2. Copy .next/static directory
  const staticDir = path.join(__dirname, '..', '.next', 'static');
  const standaloneStaticDir = path.join(standaloneNextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log("Copying .next/static directory...");
    await fs.ensureDir(standaloneNextDir);
    await fs.copy(staticDir, standaloneStaticDir);
  }

  // 3. Copy Prisma directory (schema & sqlite database)
  const prismaDir = path.join(__dirname, '..', 'prisma');
  const standalonePrismaDir = path.join(standaloneDir, 'prisma');
  if (fs.existsSync(prismaDir)) {
    console.log("Copying prisma directory...");
    await fs.copy(prismaDir, standalonePrismaDir);
  }

  // Ensure database file paths in Prisma client are correct in standalone
  // Note: For a true prod app, the DB path should be in an AppData folder outside the packaged app.
  // We'll leave it in standalone for this simple MVP.

  console.log("Done preparing for Electron.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
