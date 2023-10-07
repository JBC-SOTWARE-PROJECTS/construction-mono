import FormSelect from '@/components/common/formSelect/formSelect'
import { SubAccountSetup } from '@/graphql/gql/graphql'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Form, Modal } from 'antd'
import _ from 'lodash'
import React, { useEffect } from 'react'

export const ADD_SUBCCOUNT_RECORD = gql`
  mutation AddSubAccount($id: UUID, $accountId: UUID) {
    addSubAccountToIntegration(id: $id, accountId: $accountId)
  }
`

const ACCOUNTS_LEVEL_VALUES = gql`
  query ($domain: String, $target: String) {
    fields: getSpecificFieldsFromDomain(domain: $domain, target: $target)
  }
`

export const GET_COA_SUB = gql`
  query {
    getAllCOAParent {
      value
      label
      key
    }
  }
`

interface AddAccountProps {
  hide: (hideProps: any) => {}
  values?: SubAccountSetup
  itemid: string
}

const AddAccount = (props: AddAccountProps) => {
  const [form] = Form.useForm()

  const { loading, error, data, fetchMore } = useQuery(GET_COA_SUB)
  const [onLoadAccountsLevel, { loading: levelLoading }] = useLazyQuery(
    ACCOUNTS_LEVEL_VALUES
  )
  const [addSubAccountNow, { loading: resultLoadingAddSub }] = useMutation(
    ADD_SUBCCOUNT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        props.hide(data)
      },
    }
  )

  const handleSubmmit = (fields: SubAccountSetup) => {
    // console.log("payload for add", props.itemid, fields.id)
    addSubAccountNow({
      variables: {
        accountId: fields.id,
        id: props.itemid,
      },
    })
  }

  // useEffect(() => {
  //   onLoadAccountsLevel()
  // }, [])
  return (
    <>
      <Modal
        title={'Add Account'}
        open={true}
        okText={'Save'}
        onOk={() => form.submit()}
        //okButtonProps={{ loading: upsertLoading }}
        onCancel={() => props.hide(false)}
      >
        <Form
          form={form}
          name='basic'
          layout='vertical'
          initialValues={{ ...props.values }}
          onFinish={handleSubmmit}
          autoComplete='off'
        >
          <FormSelect
            label='Select Account'
            name='id'
            rules={[
              {
                required: true,
                message: 'Please input your Account!',
              },
            ]}
            propsselect={{
              options: data?.getAllCOAParent || [],
            }}
          />
        </Form>
      </Modal>
    </>
  )
}

export default AddAccount
