// Import Apollo Server and GraphQL schema builder
const { ApolloServer, gql } = require("apollo-server");

// Define GraphQL schema (types and queries)
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
  }
  type Query {
    user(id: ID!): User
  }
`;

// Mock user data
const users = [{ id: "1", name: "Andrew", email: "andrew@example.com" }];

// Define resolvers (functions that return data)
const resolvers = {
  Query: {
    // Resolver for "user" query
    user: (_, { id }) => users.find(u => u.id === id),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the GraphQL server
server.listen().then(({ url }) => console.log(`GraphQL API ready at ${url}`));
