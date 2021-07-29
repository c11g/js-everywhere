import { gql } from 'apollo-server-express';

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

export default typeDefs;