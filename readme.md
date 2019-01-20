# prisma-project

 ## usage instructions
 Personally, I am using ts-node to run this directly in the console, without the compilation step.
 1. Install ts-node & Typescript `npm install`.
 2. Run the file `ts-node app.ts`.

## progress checklist:
 1. [x] Creating a minimal typescript project, parsing a simple example datamodel with graphql.js into an AST and creating an internal data structure to represent models and their relationships
 2. [x] Generate a schema with the top-level single object types (for `User` that would be `query.user` without any args and just the scalar fields.
 3. [x] Add support for list scalar fields, both nullable and nonnullable fields
 4. [x] Add relation fields
 5. [x] Add the top level list fields (for `User` → `query.users`)
 6. [ ] Add simple scalar arguments (like `first` and `skip`)
 7. [ ] Add all arguments to the queries
 8. [ ] Add all mutations
 9. [ ] Add all subscriptions

