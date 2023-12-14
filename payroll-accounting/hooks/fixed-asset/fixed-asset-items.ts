import { Query } from '@/graphql/gql/graphql'
import { gql, useLazyQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'

const GET_ITEM_GQL = gql`
  query ($filter: String) {
    fixedAssetItemList(filter: $filter) {
      id
      descLong
    }
  }
`

const UseGetFixedAssetItems = (params?: string) => {
  const [fetchData, { data, loading, error }] =
    useLazyQuery<Query>(GET_ITEM_GQL)

  const fetchCallback = useCallback(() => {
    fetchData({
      variables: {
        filter: params ?? '',
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    fetchCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data: data?.fixedAssetItemList, loading, error }
}

export default UseGetFixedAssetItems
