import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const SubAccount = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/sub-acount')
)

const SubAccountPage = () => {
  return <SubAccount />
}

export default SubAccountPage
