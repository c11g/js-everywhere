import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';
import db from './db.js';
import models from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

db.connect(DB_HOST);

const typeDefs = gql`
  type Query {
    hello: String!
    notes: [Note]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(
      content: String!
      author: String!
    ): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    notes: async () => await models.Note.find(),
    note: async (parent, args) => await models.Note.findById(args.id),
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: args.author
      });
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

await server.start();
server.applyMiddleware({
  app,
  path: '/api'
});

app.get('/', (req, res) => res.send('Hello World'));

app.listen(PORT, () =>
  console.log(
    `GraphQL Server running at http://localhost:${PORT}${server.graphqlPath}`
  )
);