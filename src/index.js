const { GraphQLServer } = require("graphql-yoga")

const resolvers = {
  Query: {
    // queries go here
  },
  Mutation: {
    // mutations go here
  },
}

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
})
server.start(() => console.log("Server is running on http://localhost:4000"))
