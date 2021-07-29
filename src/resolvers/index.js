import GraphQLISODate from 'graphql-iso-date';
import Query from './query.js';
import Mutation from './mutation.js';

const { GraphQLDateTime } = GraphQLISODate;

export default {
  Query,
  Mutation,
  DateTime: GraphQLDateTime,
};
