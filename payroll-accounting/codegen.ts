import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:5827/graphql": {
        headers: {
          Cookie: "SESSION=ZjEyYzAxNTItNDg5ZC00MWQwLWJkNDEtYzg3OTM2ZDE1NTg5",
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
};

export default config;
