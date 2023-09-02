import { FormInput, FormSelect, FormTextArea } from '@/components/common'
import { SubAccountSetup } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, message } from 'antd'

interface CreateSubAccountI {
  hide: () => void
  record: SubAccountSetup
}

const SUB_ACCOUNTABLE_DOMAIN = gql`
  query {
    domain: getSubAccountableFromDomain
  }
`

const GROUP_ACCOUNT_TYPES = gql`
  query {
    parentAccountsPerCategory {
      label
      options {
        label
        value
      }
    }
  }
`

const UPDATE_INSERT = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    subAccount: upsertSubAccount(fields: $fields, id: $id) {
      payload {
        id
      }
      message
      success
    }
  }
`

export default function CreateSubAccount(props: CreateSubAccountI) {
  const { record, hide } = props

  console.log(record, 'record')
  const [form] = Form.useForm()

  const { data: getDomainData, loading: getDomainLoading } = useQuery(
    SUB_ACCOUNTABLE_DOMAIN
  )

  const { data, loading } = useQuery(GROUP_ACCOUNT_TYPES)

  const [updateInsert, { loading: updateInsertLoading }] = useMutation(
    UPDATE_INSERT,
    {
      onCompleted: ({ subAccount }) => {
        if (subAccount?.success) {
          message.success(subAccount?.message)
          hide()
        } else {
          message.error(subAccount?.message)
        }
      },
    }
  )

  const onHandleClickOk = (values: SubAccountSetup) => {
    const fields = { ...values }
    updateInsert({
      variables: {
        id: record?.id,
        fields,
      },
    })
  }

  return (
    <Modal
      open
      title='Add New Sub-Account'
      onCancel={() => props.hide()}
      okText={record?.id ? 'Save' : 'Create'}
      onOk={() => form.submit()}
      okButtonProps={{ loading: updateInsertLoading }}
      cancelButtonProps={{ loading: updateInsertLoading }}
    >
      <Divider />
      <Form
        form={form}
        name='form-fiscal'
        autoComplete='off'
        initialValues={{ ...record }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onHandleClickOk}
      >
        <FormSelect
          name='parentAccount'
          label='Parent Accounts'
          propsselect={{
            options: data?.parentAccountsPerCategory ?? [],
            optionFilterProp: 'label',
          }}
          rules={[{ required: true }]}
        />
        {/* <FormSelect
          name='parentSubAccounts'
          label='Parent Sub-accounts'
          propsselect={{
            options: data?.parentAccountsPerCategory ?? [],
          }}
        /> */}
        <FormInput
          name='subaccountCode'
          label='Code'
          rules={[{ required: true }]}
        />
        <FormInput
          name='accountName'
          label='Name'
          rules={[{ required: true }]}
        />
        <FormTextArea name='description' label='Description (Optional)' />
        {/* <FormSelect
          name='sourceDomain'
          label='Get From'
          propsselect={{
            options: (getDomainData?.domain ?? []).map((domain: string) => ({
              label: domain,
              value: domain,
            })),
          }}
        /> */}
      </Form>
    </Modal>
  )
}
