import { FormCheckBox, FormInput, FormTextArea } from '@/components/common'
import { Bank } from '@/graphql/gql/graphql'
import { gql, useMutation } from '@apollo/client'
import { Col, Form, Modal, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'

interface CreateBankAccountsI {
  hide: () => void
  record: Bank
}

const UPSERT_BANK = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertBanks(id: $id, fields: $fields) {
      id
    }
  }
`

export default function CreateBankAccounts(props: CreateBankAccountsI) {
  const { record } = props
  const [form] = useForm()

  const [mutation, { loading }] = useMutation(UPSERT_BANK)

  const onHandleSave = (fields: Bank) => {
    console.log(fields, 'fields')
    mutation({
      variables: {
        id: record?.id,
        fields,
      },
      onCompleted: () => props.hide(),
    })
  }

  return (
    <Modal
      open
      title='Bank Account'
      okText='Save'
      onCancel={props.hide}
      onOk={() => form.submit()}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        style={{ marginTop: 30 }}
        onFinish={onHandleSave}
        initialValues={{ ...record }}
      >
        <Row gutter={[8, 8]}>
          <Col flex='100%'>
            <FormInput
              name='bankaccountId'
              label='Bank Account ID'
              propsinput={{
                readOnly: true,
                placeholder: 'AUTO GENERATED',
              }}
            />
          </Col>
          <Col flex='100%'>
            <FormInput name='accountNumber' label='Account No.' />
          </Col>
          <Col flex='100%'>
            <FormInput name='accountName' label='Account Name' />
          </Col>
          <Col flex='100%'>
            <FormInput name='bankname' label='Bank Name' />
          </Col>
          <Col flex='100%'>
            <FormInput name='branch' label='Branch' />
          </Col>
          <Col flex='100%'>
            <FormTextArea name='bankAddress' label='Bank Address' />
          </Col>
          <Col flex='100%'>
            <FormCheckBox
              name='acquiringBank'
              label='Acquiring Bank'
              valuePropName='checked'
              propscheckbox={{}}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
