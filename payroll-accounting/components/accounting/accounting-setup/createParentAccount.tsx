import { FormInput, FormSelect, FormTextArea } from '@/components/common'
import { ParentAccount } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal } from 'antd'

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
      id
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
      onCompleted: () => {
        hide()
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
        // initialValues={{ ...initialValues }}
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
        />
        <FormInput name='accountCode' label='Code' />
        <FormInput name='accountName' label='Name' />
        <FormTextArea name='description' label='Description' />
      </Form>
    </Modal>
  )
}
