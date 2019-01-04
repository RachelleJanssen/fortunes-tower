import bodyParser from 'body-parser';
import express from 'express';
import expressXmlBodyparser from 'express-xml-bodyparser';
import * as fs from 'fs';
// import compression from 'compression';  // compresses requests

import initApi from './initApi';
// import { IStorage } from './models/storage';
import { collectionPath } from './utils/constants';
import initNotFound from './utils/initNotFound';

console.log(`Running node version: ${process.version}`);

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
// app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressXmlBodyparser({
    normalizeTags: false,
    normalize: false,
    trim: false,
    explicitArray: false,
  }),
);

if (!fs.existsSync(collectionPath)) {
  console.log(`creating storage file on ${collectionPath}`);
  try {
    const emptyStorage = {
      games: [],
    };
    fs.writeFileSync(collectionPath, JSON.stringify(emptyStorage), {
      flag: 'wx',
      encoding: 'utf8',
    });
  } catch (error) {
    console.log(error);
  }
}

initApi(app);
initNotFound(app);

export default app;
