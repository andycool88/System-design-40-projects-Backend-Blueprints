How to Test
REST: curl http://localhost:4000/users/1 → returns full user object.

GraphQL: Run query:

query {
  user(id: "1") {
    name
  }
}

→ returns only { "name": "Andrew" }.