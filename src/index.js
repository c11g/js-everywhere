import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';

// local module
import db from './db.js';
import typeDefs from './schema.js';
import resolvers from './resolvers/index.js';
import models from './models/index.js';

// set env
dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context(){
    // add models in context
    return { models };
  },
});

await server.start();
server.applyMiddleware({
  app,
  path: '/api',
});

app.listen(PORT, () =>
  console.log(
    `GraphQL Server running at http://localhost:${PORT}${server.graphqlPath}`
  )
);