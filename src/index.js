const { GraphQLServer } = require("graphql-yoga")
const fetch = require("node-fetch")

// prevent certificate errors
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const baseURL = process.env.BASE_URL || "https://betaapi.dictybase.local"

const userJSON = json => {
  return {
    id: json.id,
    first_name: json.attributes.first_name,
    last_name: json.attributes.last_name,
    email: json.attributes.email,
    organization: json.attributes.organization,
    first_address: json.attributes.first_address,
    second_address: json.attributes.second_address,
    city: json.attributes.city,
    zipcode: json.attributes.zipcode,
    country: json.attributes.country,
    phone: json.attributes.phone,
    created_at: json.attributes.created_at,
    updated_at: json.attributes.updated_at,
    is_active: json.attributes.is_active,
  }
}

const resolvers = {
  Query: {
    user: async (root, { id }) => {
      try {
        const res = await fetch(`${baseURL}/users/${id}`)
        const json = await res.json()
        return userJSON(json.data)
      } catch (error) {
        console.error(error)
      }
    },
    userByEmail: async (root, { email }) => {
      try {
        const res = await fetch(`${baseURL}/users/email/${email}`)
        const json = await res.json()
        return userJSON(json.data)
      } catch (error) {
        console.error(error)
      }
    },
    listUsers: async (root, { next_cursor, limit }) => {
      try {
        const nextCursor = next_cursor || 0
        const previousCursor = parseInt(nextCursor) - 1 || 0

        const res = await fetch(
          `${baseURL}/users?pagenum=${nextCursor}&pagesize=${limit}`,
        )
        const json = await res.json()

        return {
          users: json.data.map(item => {
            return userJSON(item)
          }),
          totalCount: json.meta.pagination.records,
          nextCursor: nextCursor,
          previousCursor: previousCursor,
        }
      } catch (error) {
        console.error(error)
      }
    },
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
        console.error(error)
      }
    },
    listRoles: async root => {
      try {
        const res = await fetch(`${baseURL}/roles`)
        const json = await res.json()
        return json.data.map(item => ({
          id: item.id,
          role: item.attributes.role,
          description: item.attributes.description,
          created_at: item.attributes.created_at,
          updated_at: item.attributes.updated_at,
        }))
      } catch (error) {
        console.error(error)
      }
    },
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
        console.error(error)
      }
    },
    listPermissions: async root => {
      try {
        const res = await fetch(`${baseURL}/permissions`)
        const json = await res.json()

        return json.data.map(item => ({
          id: item.id,
          permission: item.attributes.permission,
          description: item.attributes.description,
          created_at: item.attributes.created_at,
          updated_at: item.attributes.updated_at,
          resource: item.attributes.resource,
        }))
      } catch (error) {
        console.error(error)
      }
    },
  },
  Mutation: {
    // mutations go here
  },
  User: {
    roles: async ({ id }) => {
      try {
        const res = await fetch(`${baseURL}/users/${id}/roles`)
        const json = await res.json()
        return json.data.map(item => ({
          id: item.id,
          role: item.attributes.role,
          description: item.attributes.description,
          created_at: item.attributes.created_at,
          updated_at: item.attributes.updated_at,
        }))
      } catch (error) {
        console.error(error)
      }
    },
  },
  Role: {
    permissions: async ({ id }) => {
      try {
        const res = await fetch(`${baseURL}/roles/${id}/permissions`)
        const json = await res.json()
        return json.data.map(item => ({
          id: item.id,
          permission: item.attributes.permission,
          description: item.attributes.description,
          created_at: item.attributes.created_at,
          updated_at: item.attributes.updated_at,
          resource: item.attributes.resource,
        }))
      } catch (error) {
        console.error(error)
      }
    },
  },
}

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
})

server.start(() => console.log("Server is running on http://localhost:4000"))
