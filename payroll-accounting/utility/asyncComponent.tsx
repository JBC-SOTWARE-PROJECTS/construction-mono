import CircularProgress from '@/components/circularProgress'
import dynamic, { DynamicOptions, Loader } from 'next/dynamic'
import React from 'react'


function AsyncComponent<P = {}>(
  importComponent: DynamicOptions<P> | Loader<P>
) {
  return dynamic(importComponent, {
    loading: () => <CircularProgress />,
    ssr: false,
  })
}

const asyncComponent = AsyncComponent
export default asyncComponent
