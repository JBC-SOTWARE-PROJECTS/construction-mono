import { FormInput } from '@/components/common'
import { gql, useMutation } from '@apollo/client'
import { Form, Modal } from 'antd'

interface IntegrationsGroupI {
  hide: () => void
  record: any
}

const UPSERT_GQL = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertIntegrationGroup(id: $id, fields: $fields)
  }
`

export default function CreateIntegrationsGroup(props: IntegrationsGroupI) {
  const { record } = props
  const [form] = Form.useForm()

  const [onAddGroup] = useMutation(UPSERT_GQL, {
    onCompleted: () => {
      props?.hide()
    },
  })

  const onHandleClickOk = (fields: { description: string }) => {
    onAddGroup({
      variables: {
        id: props?.record?.id ?? null,
        fields,
      },
    })
  }

  return (
    <Modal
      open
      title='Add New Integration Group'
      onCancel={() => props.hide()}
      okText={record?.id ? 'Save' : 'Create'}
      onOk={() => form.submit()}
      // okButtonProps={{ loading: updateInsertLoading }}
      // cancelButtonProps={{ loading: updateInsertLoading }}
    >
      <Form form={form} onFinish={onHandleClickOk}>
        <FormInput name='description' label='Group Name' />
      </Form>
    </Modal>
  )
}
