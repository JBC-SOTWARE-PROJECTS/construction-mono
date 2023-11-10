import { FormSelect } from '@/components/common'
import FormColorPicker from '@/components/common/formColorPicker'
import { CustomerTypeOptions } from '@/constant/accountReceivables'
import {
  CREATE_CUSTOMER,
  REFERENCE_OPTION,
} from '@/graphql/accountReceivables/customers'
import { ArCustomers, ChartOfAccountGenerate } from '@/graphql/gql/graphql'
// import { ArCustomers } from '@/graphql/gql/graphql'
import { useFindOneReference } from '@/hooks/accountReceivables'
import { getRandomColor } from '@/hooks/accountReceivables/commons'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Input, Modal, Select, message } from 'antd'
import { useEffect } from 'react'
import { ACCOUNT_LIST } from '../configuration/dialog/invoiceItemForm'

const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export default function CreateCustomers({
  hide,
  values,
}: {
  hide: (hideProps: any) => {}
  values?: ArCustomers
}) {
  const [form] = Form.useForm()

  const { loading: accountListLoading, data: accountListData } = useQuery(
    ACCOUNT_LIST,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        accountType: '',
        motherAccountCode: '',
        subaccountType: '',
        description: '',
        department: '',
        excludeMotherAccount: true,
      },
      onError: (error) => {
        if (error) {
          message.error(
            'Something went wrong. Cannot generate Chart of Accounts'
          )
        }
      },
    }
  )

  const [onCreate, { loading: createLoading }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: ({ create }) => {
      const { success, message: text } = create
      message.success(text)
      if (success) hide(true)
    },
  })

  const onHandleSubmit = (fields: any) => {
    const { id } = values ?? { id: null }
    fields.otherDetails = {
      ...fields.otherDetails,
      contacts: [],
      billingContact: null,
    }
    onCreate({
      variables: {
        id,
        fields,
      },
    })
  }

  return (
    <Modal
      title='New Client'
      wrapClassName='ar-modal'
      open={true}
      okText='Create'
      onOk={() => form.submit()}
      okButtonProps={{ loading: createLoading }}
      onCancel={() => hide(false)}
      // width={1000}
    >
      <Divider dashed />
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{
          ...values,
          otherDetails: {
            color: values?.otherDetails?.color ?? getRandomColor(),
          },
        }}
        onFinish={onHandleSubmit}
      >
        <Form.Item label='Account No' name='accountNo'>
          <Input size='middle' readOnly placeholder='Auto Generated' />
        </Form.Item>
        <Form.Item
          label='Account Name'
          name='customerName'
          rules={[
            {
              required: true,
              message: 'Please input customer name!',
            },
          ]}
        >
          <Input size='middle' placeholder="A business or person's name" />
        </Form.Item>
        <Form.Item
          label='Account Type'
          name='customerType'
          rules={[
            {
              required: true,
              message: 'Please select customer type!',
            },
          ]}
        >
          <Select size='middle' options={CustomerTypeOptions} />
        </Form.Item>

        <Form.Item
          label='Address'
          name='address'
          rules={[
            {
              required: true,
              message: 'Please input address!',
            },
          ]}
        >
          <TextArea size='middle' />
        </Form.Item>

        <FormSelect
          name={['discountAndPenalties', 'salesAccountCode']}
          label='Sales Account'
          propsselect={{
            options: (accountListData?.coaList ?? []).map(
              (coa: ChartOfAccountGenerate, i: number) => {
                return {
                  label: coa.accountName as string,
                  value: coa.code as string,
                  key: `${i}-${coa.code}` as string,
                }
              }
            ),
            virtual: true,
            showSearch: true,
            optionLabelProp: 'label',
            loading: accountListLoading,
          }}
          rules={[{ required: true, message: 'Please select Sales Account!' }]}
        />
        <FormColorPicker
          label='Color'
          name={['otherDetails', 'color']}
          propscolorpicker={{
            format: 'hex',
            onChange: (_, hex: string) =>
              form.setFieldValue(['otherDetails', 'color'], hex),
          }}
        />
      </Form>
    </Modal>
  )
}
