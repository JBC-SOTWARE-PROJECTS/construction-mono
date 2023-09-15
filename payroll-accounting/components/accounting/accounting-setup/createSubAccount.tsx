import {
  FormInput,
  FormSegment,
  FormSelect,
  FormTextArea,
} from '@/components/common'
import { SubAccountSetup } from '@/graphql/gql/graphql'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { DomainEnum } from '../enum/parentAccountEnum'

interface CreateSubAccountI {
  hide: () => void
  record: SubAccountSetup
}

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

const SUB_ACCOUNT_PARENT = gql`
  query ($parentAccountId: UUID) {
    parentSubAccounts: getSubAccountForParent(
      parentAccountId: $parentAccountId
    ) {
      value: id
      label: accountName
    }
  }
`

const SUB_ACCOUNT_DOMAINS = gql`
  query {
    subAccountDomains {
      label
      value
    }
  }
`
export default function CreateSubAccount(props: CreateSubAccountI) {
  const { record, hide } = props

  const [form] = Form.useForm()
  const [subType, setSubType] = useState(
    record?.sourceDomain
      ? record?.sourceDomain == DomainEnum.NO_DOMAIN.toString()
        ? 'default'
        : 'records'
      : 'default'
  )

  const { data, loading } = useQuery(GROUP_ACCOUNT_TYPES)
  const { data: domainData, loading: domainLoading } =
    useQuery(SUB_ACCOUNT_DOMAINS)

  const [
    loadSubAccountOpt,
    { loading: subAccountLoading, data: subAccountData },
  ] = useLazyQuery(SUB_ACCOUNT_PARENT)

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
    const { subType } = form.getFieldsValue()
    const fields = { ...values }
    fields.sourceDomain =
      subType == 'default' ? DomainEnum.NO_DOMAIN : fields.sourceDomain

    console.log(fields, 'fields')
    updateInsert({
      variables: {
        id: record?.id,
        fields,
      },
    })
  }

  const onHandleSelectParent = (parentAccountId: string) => {
    loadSubAccountOpt({
      variables: {
        parentAccountId,
      },
    })
  }

  useEffect(() => {
    console.log(record?.parentAccount, 'record?.parentAccount?.id')
    if (record?.parentAccount) {
      loadSubAccountOpt({
        variables: {
          parentAccountId: record?.parentAccount,
        },
      })
    }
  }, [record, loadSubAccountOpt])

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
        name='form-sub-account'
        autoComplete='off'
        initialValues={{
          ...record,
          subType: record?.sourceDomain
            ? record?.sourceDomain == DomainEnum.NO_DOMAIN.toString()
              ? 'default'
              : 'records'
            : 'default',
        }}
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
            onSelect: (e) => onHandleSelectParent(e),
          }}
          rules={[{ required: true }]}
        />

        <FormSelect
          name={['subaccountParent', 'id']}
          label='Parent Sub-accounts'
          propsselect={{
            allowClear: true,
            options: subAccountData?.parentSubAccounts ?? [],
          }}
        />

        <FormSegment
          name='subType'
          label='Sub-account Type'
          propssegment={{
            options: [
              {
                label: 'Default',
                value: 'default',
                icon: <BarsOutlined />,
              },
              {
                label: 'Data Records',
                value: 'records',
                icon: <AppstoreOutlined />,
              },
            ],
            onChange: (e: any) => setSubType(e),
          }}
        />

        {subType == 'default' ? (
          <>
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
          </>
        ) : (
          <FormSelect
            name='sourceDomain'
            label='Data Records'
            propsselect={{
              allowClear: true,
              options: domainData?.subAccountDomains ?? [],
            }}
          />
        )}

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
