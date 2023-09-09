import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:5827/graphql': {
        headers: {
          Cookie: 'SESSION=NzA1YTViYjgtMzgyYi00NWQ0LTg3ZGMtNzcxYzlmMWRmZjFl',
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
