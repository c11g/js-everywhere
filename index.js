import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';

let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'c11g' },
  { id: '3', content: 'Oh hey look, another note!', author: 'yunseo' },
];

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

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
    notes: () => notes,
    note: (parent, args) => notes.find(note => note.id === args.id)
  },
  Mutation: {
    newNote: (parent, args) => {
      let nodeValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: args.author
      };

      notes.push(nodeValue);
      return nodeValue;
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

app.listen(port, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);