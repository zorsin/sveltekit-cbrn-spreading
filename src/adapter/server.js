import { handler } from './handler.js';
import express from 'express';
import https from 'node:https';
import http from 'node:http';
import fs from 'fs';

let ssl = false;
const keyPath = process.env.SSL_KEY;
const certPath = process.env.SSL_CERT;
const port = process.env.PORT || 3000;

const app = express();
// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

let server;
if (keyPath && certPath) {
  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);
  const options = {
    key,
    cert,
  };

  server = https.createServer(options, app);
  ssl = true;
} else {
  server = http.createServer(app);
}

server.listen(port, () => {
  console.log(`listening on port ${ssl ? 'https' : 'http'}://0.0.0.0:${port}`);
});
// SSL_KEY=./config/server.key SSL_CERT=./config/server.crt node src/server/server.js
