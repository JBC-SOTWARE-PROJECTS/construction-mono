import { FormDateRange, FormInput, FormTextArea } from '@/components/common'
import { Col, Divider, Form, Modal, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import UpsertWorkAccomplishmentsTable from './table'
import { useQuery } from '@apollo/client'
import {
  ProjectCost,
  ProjectWorkAccomplishItems,
  Query,
} from '@/graphql/gql/graphql'
import { GET_PROJECT_COST } from '@/graphql/inventory/project-queries'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface NewWorkAccomplishmentI {
  hide: () => void
  projectId: string
  id: string
}

export default function NewWorkAccomplishment(props: NewWorkAccomplishmentI) {
  const [form] = useForm()

  const [dataSource, setDataSource] = useState<ProjectWorkAccomplishItems[]>([])

  const { data, loading, refetch } = useQuery<Query>(GET_PROJECT_COST, {
    variables: {
      filter: '',
      id: props?.projectId ?? null,
    },
    skip: !!props?.id,
    onCompleted: ({ pCostByList }) => {
      const newSource = (pCostByList as ProjectWorkAccomplishItems[]).map(
        (costs) => ({
          ...costs,
          id: uuidv4(),
        })
      )
      setDataSource(newSource)
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <Modal
      title='New Work Accomplishment'
      open
      width={'100%'}
      onCancel={props.hide}
    >
      <Divider dashed />
      <Form form={form} layout='vertical'>
        <Row gutter={[8, 8]}>
          <Col flex={'300px'}>
            <FormInput name='contractID' label='Contract ID :' />
          </Col>
          <Col flex={'300px'}>
            <FormInput name='contractName' label='Contract Name :' />
          </Col>
          <Col flex={'300px'}>
            <FormDateRange name='period' label='For Period :' />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col flex={'300px'}>
            <FormInput name='preparedBy' label='Prepared By :' />
          </Col>
          <Col flex={'300px'}>
            <FormInput name='verifiedBy' label='Verified By :' />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='checkAndReviewedBy'
              label='Check and Reviewed By :'
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='recommendingApproval'
              label='Recommending Approval:'
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='approvedForPayment'
              label='Approved For Payment:'
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col flex={'600px'}>
            <FormTextArea name='location' label='Location :' />
          </Col>
        </Row>
      </Form>
      <Divider dashed />
      <UpsertWorkAccomplishmentsTable {...{ dataSource, setDataSource }} />
    </Modal>
  )
}
