import React from 'react'
import asyncComponent from '@/utility/asyncComponent'
import Head from 'next/head'
import AccessManager from '@/components/accessControl/AccessManager'

const OperationExpensesComponent = asyncComponent(
  () =>
    import('@/routes/inventory/projects/project-details/operation-expenses')
)

const ProjectOperationExpensePage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Operation Expense</title>
      </Head>
      <AccessManager
        roles={['ROLE_ADMIN', 'ROLE_PROJECT_ACCOMPLISHMENT_REPORTS']}
      >
        <div className='w-full'>
          <OperationExpensesComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  )
}

export default ProjectOperationExpensePage
