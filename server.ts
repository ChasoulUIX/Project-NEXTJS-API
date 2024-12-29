import express from 'express';
import next from 'next';
import { createServer } from 'http';
import { Request, Response } from 'express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Handle all requests with Next.js
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  // Create HTTP server
  const httpServer = createServer(server);

  // Start server
  httpServer.listen(port, () => {
    console.log(`> Server running on port ${port}`);
  });
});
