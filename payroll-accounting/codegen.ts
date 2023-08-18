import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:8080/graphql': {
        headers: {
          Cookie: 'SESSION=MjFjOGE1MDUtMWFkMi00YTE2LThiZTctZTExYmZiYzAwMWE3',
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
