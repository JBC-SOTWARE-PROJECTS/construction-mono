import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:5827/graphql': {
        headers: {
          Cookie: "SESSION=OGQxYzkyNTAtNDNlOS00OGQxLTkwN2QtMmFmNGU4MWRhNzYy",
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
