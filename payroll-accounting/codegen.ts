import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:5827/graphql': {
        headers: {
          Cookie: "SESSION=MjEzN2Y3MDAtZjdhNi00MjE0LWI3MTktNTFkNTIyZTA3ZjQ4",
        },
      },
    },
  ],
  documents: ['*/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './graphql/gql/': {
      preset: 'client',
    },
  },
}

export default config
