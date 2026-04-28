const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow;

// We need to run the Next.js standalone server
// which is usually built to .next/standalone/server.js
async function startServer() {
  return new Promise((resolve, reject) => {
    try {
      // Setup environment variables for Next.js
      process.env.NODE_ENV = 'production';
      process.env.PORT = '3000';
      process.env.HOSTNAME = 'localhost';
      
      // Determine paths. In production via electron-builder, the app runs from an ASAR archive.
      // But standalone server needs a real filesystem for some things, or we unpack it.
      // Assuming we configure electron-builder to not asar the standalone folder.
      const standalonePath = app.isPackaged 
        ? path.join(process.resourcesPath, '.next', 'standalone', 'server.js')
        : path.join(__dirname, '.next', 'standalone', 'server.js');

      if (!fs.existsSync(standalonePath)) {
        console.error("Standalone server not found at:", standalonePath);
        console.log("Make sure to run 'npm run build' first!");
        // We resolve anyway so the window opens and shows an error or we could reject
      } else {
        // Start Next.js standalone server
        require(standalonePath);
      }
      
      // Wait for server to be responsive
      const checkServer = () => {
        http.get('http://localhost:3000', (res) => {
          if (res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308) {
            resolve();
          } else {
            setTimeout(checkServer, 200);
          }
        }).on('error', () => {
          setTimeout(checkServer, 200);
        });
      };
      
      checkServer();
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.removeMenu(); // Remove default Windows menu for cleaner look

  try {
    await startServer();
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.show();
  } catch (err) {
    console.error("Failed to start:", err);
    mainWindow.loadFile('error.html');
    mainWindow.show();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
