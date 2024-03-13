import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:5827/graphql": {
        headers: {
          Cookie: "SESSION=YjQzYWQ1NGEtNzE2MS00MmYxLWE3MDUtNTA3NDI5ODlkODk1",
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
