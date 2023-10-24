import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:5827/graphql": {
        headers: {
          Cookie: "SESSION=ZDEyNDhhNDEtN2Y2Mi00NWI0LWIzMTktMzY3M2Y5NTFiYTI1",
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
