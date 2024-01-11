import { FormDateRange, FormInput, FormTextArea } from '@/components/common'
import { Col, Divider, Form, Modal, Row, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import UpsertWorkAccomplishmentsTable from './table'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  ProjectCost,
  ProjectWorkAccomplishItems,
  Projects,
  Query,
} from '@/graphql/gql/graphql'
import {
  GET_PROJECT_BY_ID,
  GET_PROJECT_COST,
} from '@/graphql/inventory/project-queries'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  calculateAmountAccomplish,
  calculateBalance,
  calculatePercentage,
} from '../../common/work-accomplishments-helpers'
import dayjs from 'dayjs'
import { useConfirmationPasswordHook } from '@/hooks'

const UPSERT_WORK_ACCOMPLISH = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $itemFields: [Map_String_ObjectScalar]
  ) {
    upsertProjectWorkAccomplish(
      id: $id
      fields: $fields
      itemFields: $itemFields
    ) {
      success
      response {
        id
      }
      message
    }
  }
`

const FIND_ONE_WORK_ACCOMPLISH = gql`
  query ($id: UUID) {
    findOne: findOneProjectWorkAccomplish(id: $id) {
      id
      periodStart
      periodEnd
      preparedBy
      verifiedBy
      checkedBy
      recommendingApproval
      approvedForPayment
    }
  }
`

const GET_PROJECT_WORK_ACCOMPLISH_ITEMS = gql`
  query ($id: UUID) {
    items: getProjectWorkAccomplishItemsByGroupId(id: $id) {
      id
      itemNo
      unit
      description
      qty
      cost
      payments
      relativeWeight
      prevQty
      thisPeriodQty
      toDateQty
      balanceQty
      prevAmount
      thisPeriodAmount
      toDateAmount
      balanceAmount
      percentage
    }
  }
`

interface NewWorkAccomplishmentI {
  hide: () => void
  projectId: string
  id: string
}

interface FormI {
  contractID: string
  contractName: string
  period: any
  preparedBy: string
  verifiedBy: string
  checkedBy: string
  recommendingApproval: string
  approvedForPayment: string
  location: string
}

export default function NewWorkAccomplishment(props: NewWorkAccomplishmentI) {
  const [form] = useForm()
  const [showPasswordConfirmation] = useConfirmationPasswordHook()

  const [dataSource, setDataSource] = useState<ProjectWorkAccomplishItems[]>([])

  const { loading: findOneProjectLoading } = useQuery<Query>(
    GET_PROJECT_BY_ID,
    {
      variables: {
        id: props?.projectId,
      },
      onCompleted: (data) => {
        let result = data?.projectById as Projects
        if (result.id) {
          form.setFieldsValue({
            contractID: result?.contractId,
            contractName: result?.description,
            location: result?.location?.fullAddress,
          })
        }
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  const { loading: findAllItemByGroup } = useQuery(
    GET_PROJECT_WORK_ACCOMPLISH_ITEMS,
    {
      variables: {
        id: props?.id,
      },
      skip: !props?.id,
      onCompleted: ({ items }) => {
        setDataSource(items as ProjectWorkAccomplishItems[])
      },
    }
  )

  const { loading } = useQuery<Query>(GET_PROJECT_COST, {
    variables: {
      filter: '',
      id: props?.projectId,
    },
    skip: !!props?.id,
    onCompleted: ({ pCostByList }) => {
      const newSource = (pCostByList as ProjectCost[]).map((costs) => {
        let row = {
          ...costs,
          project: props?.projectId,
          projectCost: costs?.id,
          prevQty: costs?.billedQty,
          id: uuidv4(),
        } as ProjectWorkAccomplishItems
        row = calculateBalance(row)
        row = calculateAmountAccomplish(row)
        row = calculatePercentage(row)
        return row
      })
      setDataSource(newSource as ProjectWorkAccomplishItems[])
    },
    fetchPolicy: 'cache-and-network',
  })

  const { loading: findOneLoading } = useQuery(FIND_ONE_WORK_ACCOMPLISH, {
    variables: {
      id: props?.id,
    },
    // skip: !props?.id,
    onCompleted: ({ findOne }) => {
      const {
        periodStart,
        periodEnd,
        preparedBy,
        verifiedBy,
        checkedBy,
        recommendingApproval,
        approvedForPayment,
      } = findOne
      console.log({
        period: [dayjs(periodStart), dayjs(periodEnd)],
        preparedBy,
        verifiedBy,
        checkedBy,
        recommendingApproval,
        approvedForPayment,
      })
      form.setFieldsValue({
        period: [dayjs(periodStart), dayjs(periodEnd)],
        preparedBy,
        verifiedBy,
        checkedBy,
        recommendingApproval,
        approvedForPayment,
      })
    },
  })

  const [upsertMutation, { loading: upsertLoading }] = useMutation(
    UPSERT_WORK_ACCOMPLISH
  )

  const onHandleFinish = (values: FormI) => {
    const fields = {
      ...values,
      project: props?.projectId,
      periodStart: dayjs(values?.period[0]).startOf('day').format('YYYY-MM-DD'),
      periodEnd: dayjs(values?.period[1]).startOf('day').format('YYYY-MM-DD'),
    }

    delete fields.period

    showPasswordConfirmation(() =>
      upsertMutation({
        variables: {
          id: props?.id,
          fields,
          itemFields: dataSource,
        },
        onCompleted: ({ upsertProjectWorkAccomplish }) => {
          const { success, message: messageText } =
            upsertProjectWorkAccomplish ?? { success: false, message: '' }
          if (success) {
            message.success(messageText)
            props?.hide()
          } else message.error(messageText)
        },
      })
    )
  }

  const tableLoadingIndicator = loading || findOneLoading

  return (
    <Modal
      title='New Work Accomplishment'
      open
      width={'100%'}
      onCancel={props.hide}
      okText='Submit'
      onOk={() => form.submit()}
      okButtonProps={{
        loading: upsertLoading,
        style: { marginRight: '70px' },
      }}
    >
      <Divider dashed />
      <Form form={form} layout='vertical' onFinish={onHandleFinish}>
        <Row gutter={[8, 8]}>
          <Col flex={'300px'}>
            <FormInput
              name='contractID'
              label='Contract ID :'
              propsinput={{ readOnly: true }}
            />
          </Col>
          <Col flex={'600px'}>
            <FormInput
              name='contractName'
              label='Contract Name :'
              propsinput={{ readOnly: true }}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col flex={'300px'}>
            <FormDateRange
              name='period'
              label='For Period :'
              rules={[{ required: true }]}
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='preparedBy'
              label='Prepared By :'
              rules={[{ required: true }]}
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='verifiedBy'
              label='Verified By :'
              rules={[{ required: true }]}
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='checkedBy'
              label='Check and Reviewed By :'
              rules={[{ required: true }]}
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='recommendingApproval'
              label='Recommending Approval:'
              rules={[{ required: true }]}
            />
          </Col>
          <Col flex={'300px'}>
            <FormInput
              name='approvedForPayment'
              label='Approved For Payment:'
              rules={[{ required: true }]}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col flex={'600px'}>
            <FormTextArea
              name='location'
              label='Location :'
              propstextarea={{ readOnly: true }}
            />
          </Col>
        </Row>
      </Form>
      <Divider dashed />
      <UpsertWorkAccomplishmentsTable
        {...{ dataSource, setDataSource, tableLoadingIndicator }}
      />
    </Modal>
  )
}
