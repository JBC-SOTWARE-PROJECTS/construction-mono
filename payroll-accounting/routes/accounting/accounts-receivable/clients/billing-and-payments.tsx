import { ACCOUNT_LIST } from '@/components/accountReceivables/configuration/dialog/invoiceItemForm'
import { FormCheckBox, FormInputNumber, FormSelect } from '@/components/common'
import {
  CREATE_CUSTOMER,
  FIND_ONE_CUSTOMER,
  FIND_ONE_CUSTOMER_SETTINGS,
} from '@/graphql/accountReceivables/customers'
import { ChartOfAccountGenerate } from '@/graphql/gql/graphql'
import asyncComponent from '@/utility/asyncComponent'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Divider,
  Form,
  InputNumber,
  Select,
  Space,
  message,
} from 'antd'

const AccountsProfileHeader = asyncComponent(
  () => import('@/components/accountReceivables/customers/accountsHeader')
)

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

interface AccountSettingsI {
  id: string
}

export default function AccountSettings(props: AccountSettingsI) {
  const { id } = props
  const [form] = Form.useForm()

  const { data, loading, refetch } = useQuery(FIND_ONE_CUSTOMER_SETTINGS, {
    variables: {
      id,
    },
    onCompleted: ({ customer }) => {
      console.log(customer, 'customer')
      const fields = customer?.discountAndPenalties ?? null

      if (fields)
        form.setFieldsValue({
          salesAccountCode: fields?.salesAccountCode ?? '',
          creditLimit: fields?.creditLimit ?? 0,
          creditPeriod: fields?.creditPeriod ?? 0,
          blockOnCreditLimit: fields?.blockOnCreditLimit ?? false,
          autoDiscountInPayment: fields?.autoDiscountInPayment ?? false,
          paymentDiscounts: fields?.paymentDiscounts ?? [],
          overduePenalties: fields?.overduePenalties ?? [],
        })
    },
  })

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
    },
  })

  const selectAfter = (
    <Select
      style={{ minWidth: 200 }}
      defaultValue='days-after'
      options={[
        { label: 'after the invoice date', value: 'days-after' },
        { label: 'after the invoice month', value: 'month-after' },
      ]}
    />
  )

  const onHandleFormSubmit = (discountAndPenalties: any) => {
    onCreate({
      variables: {
        id,
        fields: { discountAndPenalties },
      },
    })
  }

  return (
    <AccountsProfileHeader {...{ id, activeMenu: 'billing-and-payments' }}>
      <ProCard
        headerBordered
        title='Billing & Payments'
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Divider orientation='left' dashed plain>
          Sales Default
        </Divider>
        <Form
          name='sales-default'
          form={form}
          {...formItemLayout}
          layout='vertical'
          // initialValues={{ ...values }}
        >
          <FormSelect
            name='salesAccountCode'
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
            rules={[
              { required: true, message: 'Please select Sales Account!' },
            ]}
          />
        </Form>
        <Divider orientation='left' dashed plain>
          Credit limit
        </Divider>
        <Form
          form={form}
          {...formItemLayout}
          layout='vertical'
          // initialValues={{ ...values }}
        >
          <FormInputNumber
            name='creditLimit'
            label='Credit limit amount :'
            propsinputnumber={{
              style: { width: 200 },
            }}
          />

          <FormInputNumber
            name='creditPeriod'
            label='Credit period :'
            propsinputnumber={{
              addonAfter: selectAfter,
              formatter: (value) => `${value} day(s)`,
              parser: (value) => value!.replace(' day(s)', ''),
            }}
          />

          <FormCheckBox
            name='blockOnCreditLimit'
            valuePropName='checked'
            propscheckbox={{
              children:
                'Stop producing new invoices upon reaching the credit limit.',
            }}
          />
        </Form>
        <Divider orientation='left' dashed plain style={{ marginTop: 50 }}>
          Payment Discount
        </Divider>
        <div style={{ maxWidth: 600 }}>
          <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            onFinish={onHandleFormSubmit}
          >
            <Form.List name='paymentDiscounts'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align='baseline'
                    >
                      {`${key + 1}.)`}
                      <Form.Item
                        {...restField}
                        label='Discount rate'
                        name={[name, 'rate']}
                        rules={[
                          { required: true, message: 'Missing discount rate' },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) => `${value}%`}
                          parser={(value) => value!.replace('%', '')}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'maximumDays']}
                        label='If payment is made within'
                        rules={[{ required: true, message: 'Missing days' }]}
                      >
                        <InputNumber
                          style={{ width: 185 }}
                          formatter={(value) => `${value} day(s)`}
                          parser={(value) => value!.replace(' day(s)', '')}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ marginLeft: 25 }}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Prompt Payment Discount Setup
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <FormCheckBox
              name='autoDiscountInPayment'
              valuePropName='checked'
              propscheckbox={{
                children: 'Auto calculate discount in payment posting.',
              }}
            />
          </Form>
        </div>
        <Divider orientation='left' dashed plain style={{ marginTop: 50 }}>
          Penalties for Overdue
        </Divider>
        <div style={{ maxWidth: 600 }}>
          <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            onFinish={onHandleFormSubmit}
          >
            <Form.List name='overduePenalties'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => {
                    return (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align='baseline'
                      >
                        {`${index + 1}.)`}
                        <Form.Item
                          {...restField}
                          label='Surcharge rate'
                          name={[name, 'rate']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing surcharge rate',
                            },
                          ]}
                        >
                          <InputNumber
                            formatter={(value) => `${value}%`}
                            parser={(value) => value!.replace('%', '')}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'maximumDays']}
                          label='If not settle within'
                          rules={[{ required: true, message: 'Missing days' }]}
                        >
                          <InputNumber
                            style={{ width: 185 }}
                            formatter={(value) => `${value} day(s)`}
                            parser={(value) => value!.replace(' day(s)', '')}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ marginLeft: 25 }}
                        />
                      </Space>
                    )
                  })}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Charges for Late Settlement
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
        <Divider dashed />
        <Space align='end'>
          <Button type='primary' onClick={() => form.submit()}>
            Save
          </Button>
        </Space>
      </ProCard>
    </AccountsProfileHeader>
  )
}
