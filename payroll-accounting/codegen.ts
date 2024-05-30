import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:5827/graphql": {
        headers: {
          Cookie: "SESSION=MTI0YjBkMjYtNjQxMy00ODE1LWE3YmQtODgwZDFkMTI3ODQ2",
        },
      },
    },
  ],
  documents: ["*/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./graphql/gql/": {
      preset: "client",
    },
  },
}

export default config
