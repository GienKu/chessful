import path from 'path';
import express, { Application } from 'express';

// Path to the client/dist folder
const staticPath = path.join(__dirname, '../../../../client');

export function serveStaticFiles(app: Application) {
  // Serve static files from client/dist
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}
