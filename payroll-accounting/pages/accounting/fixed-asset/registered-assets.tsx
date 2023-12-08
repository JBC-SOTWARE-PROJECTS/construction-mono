import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const RegisteredAsset = asyncComponent(
  () => import('@/routes/accounting/fixed-asset/registered-assets')
)

const RegisteredAssetPage = () => {
  return <RegisteredAsset />
}

export default RegisteredAssetPage
