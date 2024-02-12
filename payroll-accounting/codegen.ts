import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:5827/graphql": {
        headers: {
          Cookie: "SESSION=ZjY1MjU4NTItZTFkYy00MzU1LThlMDYtY2E2NDdlODdhYTM2",
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
