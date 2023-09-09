import { FormInput, FormSelect, FormTextArea } from '@/components/common'
import { ParentAccount } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, message } from 'antd'

interface CreateMotherAccountI {
  hide: () => void
  record: ParentAccount
}

const GROUP_ACCOUNT_TYPES = gql`
  query {
    optGroup: groupedAccountTypes {
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
    parentAccount: updateInsertParentAccount(fields: $fields, id: $id) {
      payload {
        id
      }
      message
      success
    }
  }
`

export default function CreateMotherAccount(props: CreateMotherAccountI) {
  const { record, hide } = props

  const [form] = Form.useForm()

  const { data, loading } = useQuery(GROUP_ACCOUNT_TYPES)
  const [updateInsert, { loading: updateInsertLoading }] = useMutation(
    UPDATE_INSERT,
    {
      onCompleted: ({ parentAccount }) => {
        if (parentAccount?.success) {
          message.success(parentAccount?.message)
          hide()
        } else {
          message.error(parentAccount?.message)
        }
      },
    }
  )

  const onHandleClickOk = (values: ParentAccount) => {
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
      title='Add New Parent Account'
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
          name='accountType'
          label='Account Type'
          propsselect={{
            options: data?.optGroup ?? [],
          }}
          rules={[{ required: true }]}
        />
        <FormInput
          name='accountCode'
          label='Code'
          rules={[{ required: true }]}
        />
        <FormInput
          name='accountName'
          label='Name'
          rules={[{ required: true }]}
        />
        <FormTextArea name='description' label='Description (Optional)' />
      </Form>
    </Modal>
  )
}
