import bodyParser from 'body-parser';
import express from 'express';
import expressXmlBodyparser from 'express-xml-bodyparser';
import * as fs from 'fs';
import mongoose from 'mongoose';
import { isDev } from './env';
import { log } from './utils/logging/logger';
// import compression from 'compression';  // compresses requests

import initApi from './initApi';
import { collectionPath } from './utils/constants';
import initNotFound from './utils/initNotFound';

console.log(`Running node version: ${process.version}`);

// Create Express server
const app = express();

// set the session for login cookies, if you require cookies
// app.use(expressSession({ secret: 'typescript boilerplate', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

// Build the connection string
const dbURI = 'mongodb://localhost:27017';

// Create the database connection
mongoose.connect(
  dbURI,
  { useNewUrlParser: true, dbName: 'fortunesTower' },
);

if (isDev) {
  mongoose.set('debug', true);
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on(
  'connected',
  (): void => {
    log().info(`Mongoose default connection open to ${dbURI}`);
  },
);

// If the connection throws an error
mongoose.connection.on(
  'error',
  (err): void => {
    log().error(`Mongoose default connection error: ${err}`);
  },
);

// When the connection is disconnected
mongoose.connection.on(
  'disconnected',
  (): void => {
    log().error('Mongoose default connection disconnected');
  },
);

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
