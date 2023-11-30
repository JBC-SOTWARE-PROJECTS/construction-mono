import { FormInput, FormTextArea } from '@/components/common'
import {
  CREATE_CUSTOMER,
  FIND_ONE_CUSTOMER_CONTACTS,
} from '@/graphql/accountReceivables/customers'
import asyncComponent from '@/utility/asyncComponent'
import { IUserEmployee } from '@/utility/interfaces'
import { SaveOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Col, Form, Row, message } from 'antd'

const AccountsProfileHeader = asyncComponent(
  () => import('@/components/accountReceivables/customers/accountsHeader')
)

interface AccountsContactDetailsI {
  id: any
  account?: IUserEmployee
}

export interface ContactStateI {
  informationDisable: boolean
  specificDisable: boolean
}

export type ContactActionI = { type: 'toggleInfo' } | { type: 'toggleSpecific' }

type Reducer = (state: ContactStateI, action: ContactActionI) => ContactStateI

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'toggleInfo':
      return { ...state, informationDisable: !state.informationDisable }
    case 'toggleSpecific':
      return { ...state, specificDisable: !state.specificDisable }
    default:
      return state
  }
}

const initialValue = {
  informationDisable: true,
  specificDisable: true,
}

export default function ARAccountsContactDetails(
  props: AccountsContactDetailsI
) {
  const { id, account } = props
  const [form] = Form.useForm()

  const { data, loading, refetch } = useQuery(FIND_ONE_CUSTOMER_CONTACTS, {
    variables: {
      id,
    },
    onCompleted: ({ customer }) => {
      if (customer) {
        form.setFieldsValue({ ...customer })
      }
    },
  })

  const [onCreate, { loading: createLoading }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: ({ create }) => {
      const { success, message: text } = create
      success ? message.success(text) : message.error('Error.')
    },
  })

  const onHandleFormSubmit = () => {
    const values = form.getFieldsValue()

    onCreate({
      variables: {
        id,
        fields: { ...values },
      },
    })
  }

  return (
    <AccountsProfileHeader {...{ id, activeMenu: 'contact-details', account }}>
      <ProCard
        headerBordered
        title='Contact Details'
        style={{ marginTop: 20, marginBottom: 20 }}
        extra={[
          <Button
            key={1}
            type='primary'
            onClick={onHandleFormSubmit}
            loading={createLoading}
            icon={<SaveOutlined />}
          >
            Save Clients Contact Information
          </Button>,
        ]}
      >
        <Form
          name='information-form'
          form={form}
          layout='vertical'
          autoComplete='off'
          initialValues={{ ...data?.customer }}
        >
          <Row gutter={[8, 8]} wrap>
            <Col flex='100%'>
              <FormInput label='Contact Person' name='contactPerson' />
            </Col>
            <Col flex='50%'>
              <FormInput label='Contact No' name='contactNo' />
            </Col>
            <Col flex='50%'>
              <FormInput label='Contact Email' name='contactEmail' />
            </Col>
            <Col flex='100%'>
              <FormTextArea label='Client Full Address' name='address' />
            </Col>
          </Row>
        </Form>
      </ProCard>
    </AccountsProfileHeader>
  )
}
