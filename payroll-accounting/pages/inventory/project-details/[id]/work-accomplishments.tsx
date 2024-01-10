import React from 'react'
import asyncComponent from '@/utility/asyncComponent'
import Head from 'next/head'
import AccessManager from '@/components/accessControl/AccessManager'

const WorkAccomplishmentComponent = asyncComponent(
  () =>
    import('@/routes/inventory/projects/project-details/work-accomplishments')
)

const ProjectsDetailsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Work Accomplishments</title>
      </Head>
      <AccessManager
        roles={['ROLE_ADMIN', 'ROLE_PROJECT_ACCOMPLISHMENT_REPORTS']}
      >
        <div className='w-full'>
          <WorkAccomplishmentComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  )
}

export default ProjectsDetailsPage
