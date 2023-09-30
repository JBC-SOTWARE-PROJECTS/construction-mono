import FormSelect from '@/components/common/formSelect/formSelect'
import { SubAccountSetup } from '@/graphql/gql/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Form, Modal, message } from 'antd'

export const INTEGRATION_GROUP = gql`
  query {
    integrationGroupList {
      id
      description
    }
  }
`
export const INTEGRATION_GROUP_OPTION = gql`
  query {
    result: integrationGroupList {
      value: id
      label: description
    }
  }
`

export const INTEGRATION_TRANSFER = gql`
  mutation TransferIntegration($id: UUID, $fields: Map_String_ObjectScalar) {
    transferIntegration(id: $id, fields: $fields)
  }
`

export const INTEGRATION_PER_GROUP = gql`
  query ($id: UUID, $filter: String, $size: Int, $page: Int) {
    integrationGroupItemList(
      id: $id
      filter: $filter
      size: $size
      page: $page
    ) {
      content {
        id
        description
        flagValue
        orderPriority
        domain
      }
      totalPages
      size
      number
      totalElements
    }
  }
`

interface AddAccountProps {
  hide: (hideProps: any) => {}
  values?: SubAccountSetup
  itemid: string
  // refetch: () => void
}

const IntegrationTransfer = (props: AddAccountProps) => {
  const [form] = Form.useForm()

  const { data, loading } = useQuery(INTEGRATION_GROUP_OPTION)
  const [onTransferIntegration] = useMutation(INTEGRATION_TRANSFER)

  const handleSubmmit = (fields: SubAccountSetup) => {
    const integrationId = props.itemid
    //console.log("payload for add", fields)
    //console.log("integrationId", integrationId)
    onTransferIntegration({
      variables: {
        id: integrationId,
        fields: fields,
      },
      onCompleted: () => {
        message.success('Integration Transfer')
        props.hide(true)
      },
      refetchQueries: [INTEGRATION_PER_GROUP],
    })
  }

  return (
    <>
      <Modal
        title={'Transfer Integration'}
        open={true}
        okText={'Update'}
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
            label='Integration Group'
            name={['integrationGroup', 'id']}
            propsselect={{
              options: data.result,
              // options: (data?.getSetupBySubAccountTypeAll || []).map((item: any) => {
              //     return {
              //         label: item.description + " [" + item.subaccountTypeDesc + "]",
              //         value: item.id
              //     }
              // }),
            }}
          />
        </Form>
      </Modal>
    </>
  )
}

export default IntegrationTransfer
