import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

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

// JWT에서 사용자 정보 가져오기
const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }){
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    // add models, user in context
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