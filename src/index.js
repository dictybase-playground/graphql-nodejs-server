const { GraphQLServer } = require("graphql-yoga")
const fetch = require("node-fetch")

// prevent certificate errors
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const baseURL = "https://betaapi.dictybase.local"

const userJSON = json => {
  return {
    id: json.data.id,
    first_name: json.data.attributes.first_name,
    last_name: json.data.attributes.last_name,
    email: json.data.attributes.email,
    organization: json.data.attributes.organization,
    first_address: json.data.attributes.first_address,
    second_address: json.data.attributes.second_address,
    city: json.data.attributes.city,
    zipcode: json.data.attributes.zipcode,
    country: json.data.attributes.country,
    phone: json.data.attributes.phone,
    created_at: json.data.attributes.created_at,
    updated_at: json.data.attributes.updated_at,
    is_active: json.data.attributes.is_active,
  }
}

const resolvers = {
  Query: {
    user: async (root, { id }) => {
      try {
        const res = await fetch(`${baseURL}/users/${id}`)
        const json = await res.json()
        return userJSON(json)
      } catch (error) {
        console.log(error)
      }
    },
    userByEmail: async (root, { email }) => {
      try {
        const res = await fetch(`${baseURL}/users/email/${email}`)
        const json = await res.json()
        return userJSON(json)
      } catch (error) {
        console.log(error)
      }
    },
    // listUsers: async (root, { next_cursor, limit }) => {
    //   try {
    //     const res = await fetch(`${baseURL}/users`)
    //     const json = await res.json()
    //     console.log(json)
    //     return json
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    role: async (root, { id }) => {
      try {
        const res = await fetch(`${baseURL}/roles/${id}`)
        const json = await res.json()
        return {
          id: json.data.id,
          role: json.data.attributes.role,
          description: json.data.attributes.description,
          created_at: json.data.attributes.created_at,
          updated_at: json.data.attributes.updated_at,
        }
      } catch (error) {
        console.log(error)
      }
    },
    // listRoles: async root => {
    //   try {
    //     const res = await fetch(`${baseURL}/roles`)
    //     const json = await res.json()
    //     console.log(json)
    //     return json
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    permission: async (root, { id }) => {
      try {
        const res = await fetch(`${baseURL}/permissions/${id}`)
        const json = await res.json()
        return {
          id: json.data.id,
          permission: json.data.attributes.permission,
          description: json.data.attributes.description,
          created_at: json.data.attributes.created_at,
          updated_at: json.data.attributes.updated_at,
          resource: json.data.attributes.resource,
        }
      } catch (error) {
        console.log(error)
      }
    },
    // listPermissions: async root => {
    //   try {
    //     const res = await fetch(`${baseURL}/permissions`)
    //     const json = await res.json()
    //     console.log(json)
    //     return json
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
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
