import { FormSelect } from '@/components/common'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

const QUERY_GQL = gql`
  query ($reportType: ReportType) {
    coaList: getParentAccountForReportLayout(reportType: $reportType) {
      value: id
      label: accountName
    }
  }
`

const ITEMS_MUTATION_QUERY = gql`
  mutation ($parentId: UUID, $accounts: [UUID]) {
    onAddMultipleAccounts(parentId: $parentId, accounts: $accounts) {
      success
    }
  }
`

export default function ParentAccountSelector(props: any) {
  const [form] = useForm()
  const { data, loading } = useQuery(QUERY_GQL, {
    variables: {
      reportType: props?.reportType,
    },
  })

  const [onInserts, { loading: insertsLoading }] = useMutation(
    ITEMS_MUTATION_QUERY,
    {
      onCompleted: () => {},
    }
  )

  const onClickSave = () => {
    const { accounts } = form.getFieldsValue()
    onInserts({
      variables: {
        parentId: props?.parentId ?? null,
        itemType: 'MOTHER',
        accounts,
      },
      onCompleted: () => {
        props.hide()
      },
    })
  }

  return (
    <Modal
      title='Select Accounts'
      open
      onCancel={props.hide}
      onOk={onClickSave}
      okButtonProps={{
        loading: insertsLoading,
      }}
    >
      <Form form={form}>
        <FormSelect
          name='accounts'
          label='Accounts'
          propsselect={{
            loading,
            allowClear: true,
            optionFilterProp: 'label',
            mode: 'multiple',
            style: { width: '100%' },
            placeholder: 'Select Accounts here',
            options: data?.coaList ?? [],
          }}
        />
      </Form>
    </Modal>
  )
}
