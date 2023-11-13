import FormSelect from '@/components/common/formSelect/formSelect'
import { ChartOfAccountGenerate } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Space, message } from 'antd'
import { ACCOUNT_LIST } from './dialog/invoiceItemForm'
import { useForm } from 'antd/es/form/Form'

const UPSERT_CONSTANT = gql`
  mutation ($id: UUID, $type: String, $fields: Map_String_ObjectScalar) {
    upsertConstantsByType(id: $id, type: $type, fields: $fields) {
      payload
      success
    }
  }
`

const GET_CONFIG = gql`
  query {
    getReceivableConfig {
      promissoryNoteSalesAccount {
        id
        value
      }
    }
  }
`

export default function ARDefaultConfig() {
  const [form] = useForm()

  const { data: configData } = useQuery(GET_CONFIG)

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

  const [onUpsert, { loading }] = useMutation(UPSERT_CONSTANT, {
    onCompleted: () => {},
  })

  const onSelectSalesAccount = (id: string, value: string) => {
    onUpsert({
      variables: {
        id,
        fields: {
          value,
        },
        type: 'arDefaultSettings',
      },
    })
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Card bordered={false}>
        <Form
          form={form}
          name='wrap'
          labelCol={{ flex: '300px' }}
          labelAlign='left'
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          // style={{ maxWidth: 600 }}
          initialValues={{ ...configData?.getReceivableConfig }}
        >
          <FormSelect
            name={['promissoryNoteSalesAccount', 'value']}
            label='Promissory Note Default Sales Account'
            propsselect={{
              size: 'large',
              options: (accountListData?.coaList ?? []).map(
                (coa: ChartOfAccountGenerate, i: number) => {
                  return {
                    label: `${coa.code} ${coa.accountName}` as string,
                    value: coa.code as string,
                    key: `${i}-${coa.code}` as string,
                  }
                }
              ),
              virtual: true,
              showSearch: true,
              optionLabelProp: 'label',
              loading: accountListLoading,
              onSelect: (e) =>
                onSelectSalesAccount(
                  configData?.getReceivableConfig?.promissoryNoteSalesAccount
                    ?.id,
                  e
                ),
            }}
            rules={[
              { required: true, message: 'Please select Sales Account!' },
            ]}
          />
        </Form>
      </Card>
    </Space>
  )
}
