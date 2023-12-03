import {
  FormInput,
  FormInputNumber,
  FormSelect,
  FormTextArea,
} from '@/components/common'
import { InvoiceItemCategory } from '@/constant/accountReceivables'
import { ChartOfAccountGenerate } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Col, Divider, Form, Modal, Row, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'

export const ACCOUNT_LIST = gql`
  query (
    $accountType: String
    $motherAccountCode: String
    $accountCategory: String
    $subaccountType: String
    $accountName: String
    $department: String
    $excludeMotherAccount: Boolean
  ) {
    coaList: getAllChartOfAccountGenerate(
      accountType: $accountType
      motherAccountCode: $motherAccountCode
      subaccountType: $subaccountType
      accountCategory: $accountCategory
      accountName: $accountName
      department: $department
      excludeMotherAccount: $excludeMotherAccount
    ) {
      code
      accountName
      accountType
    }
  }
`

const SAVE_ITEM = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    addArInvoiceParticulars(id: $id, fields: $fields) {
      success
      message
      response {
        id
      }
    }
  }
`

interface InvoiceItemsFormI {
  hide: () => void
  record: any
  id?: string
}

export default function InvoiceItemsForm(props: InvoiceItemsFormI) {
  const { id, hide, record } = props
  const [form] = useForm()

  const { loading, data } = useQuery(ACCOUNT_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: {
      accountCategory: '',
      accountType: '',
      motherAccountCode: '',
      subaccountType: '',
      description: '',
      department: '',
      excludeMotherAccount: true,
    },
    onError: (error) => {
      if (error) {
        message.error('Something went wrong. Cannot generate Chart of Accounts')
      }
    },
  })

  const [onSaveUpdate, { loading: saveLoading }] = useMutation(SAVE_ITEM)

  const onSubmitCapture = (fields: any) => {
    onSaveUpdate({
      variables: {
        id,
        fields,
      },
      onCompleted: () => hide(),
    })
  }

  return (
    <Modal
      title='New Invoice Item'
      open
      onCancel={() => hide()}
      onOk={() => form.submit()}
      confirmLoading={saveLoading}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmitCapture}
        initialValues={...record}
      >
        <Row gutter={[8, 8]} style={{ marginTop: 25 }}>
          <Col span={8}>
            <FormInput
              name='itemCode'
              label='Code'
              propsinput={{ width: '100%', size: 'large' }}
              rules={[{ required: true, message: 'Please input Code!' }]}
            />
          </Col>
          <Col span={16}>
            <FormInput
              name='itemName'
              label='Name'
              propsinput={{ width: '100%', size: 'large' }}
              rules={[{ required: true, message: 'Please input Name!' }]}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              name='description'
              label='Description'
              propstextarea={{}}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[8, 8]} style={{ marginTop: 25 }}>
          <Col span={12}>
            <FormSelect
              name='itemCategory'
              label='Category'
              propsselect={{ options: InvoiceItemCategory, size: 'large' }}
              rules={[{ required: true, message: 'Please input Name!' }]}
            />
          </Col>
          <Col span={12}>
            <FormInputNumber
              name='salePrice'
              label='Sale Price'
              propsinputnumber={{ width: '100%', size: 'large' }}
              rules={[{ required: true, message: 'Please input Code!' }]}
            />
          </Col>
          <Col span={24}>
            <FormSelect
              name='salesAccountCode'
              label='Sales Account'
              propsselect={{
                options: (data?.coaList ?? []).map(
                  (coa: ChartOfAccountGenerate, i: number) => {
                    return {
                      label: coa.accountName as string,
                      value: coa.code as string,
                      key: `${i}-${coa.code}` as string,
                    }
                  }
                ),
                size: 'large',
                virtual: true,
                showSearch: true,
                optionLabelProp: 'label',
                loading,
              }}
              rules={[{ required: true, message: 'Please input Name!' }]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
