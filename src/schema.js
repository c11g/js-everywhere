import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar DateTime

  type Query {
    notes: [Note]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(
      content: String!
      author: String!
    ): Note!
    updateNote(
      id: ID!
      content: String!
    ): Note!
    deleteNote(
      id: ID!
    ): Boolean!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export default typeDefs;