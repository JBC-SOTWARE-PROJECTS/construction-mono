import { FormSelect } from '@/components/common'
import FormInput from '@/components/common/formInput/formInput'
import { MathematicalOperations } from '@/constant/financial-setup'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Form, Modal, Transfer } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { TransferDirection } from 'antd/es/transfer'
import { useState } from 'react'

const ITEMS_MUTATION_QUERY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayoutItem(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`

const GQL_QUERY = gql`
  query ($reportType: ReportType) {
    groups: getReportItemsByReportType(reportType: $reportType) {
      key: id
      title
    }
  }
`

interface CreateReportFormula {
  reportType: string
  reportsLayoutId: string
}
export default function CreateReportFormula(props: any) {
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const { reportType, reportsLayoutId } = props
  const [form] = useForm()

  const {
    data,
    loading: groupsLoading,
    refetch,
  } = useQuery(GQL_QUERY, {
    variables: {
      reportType,
    },
  })

  const [onInserts, { loading: insertsLoading }] = useMutation(
    ITEMS_MUTATION_QUERY,
    {
      onCompleted: () => {},
    }
  )

  const onClickSave = () => {
    const { title, itemType } = form.getFieldsValue()
    onInserts({
      variables: {
        id: null,
        fields: {
          reportsLayoutId,
          account: null,
          reportLayoutItemsParent: null,
          orderNo: 0,
          title,
          isFormula: true,
          itemType,
          formulaGroups: targetKeys,
        },
      },
      onCompleted: () => {
        props.hide()
      },
    })
  }

  const onChange = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    console.log('targetKeys:', nextTargetKeys)
    console.log('direction:', direction)
    console.log('moveKeys:', moveKeys)
    setTargetKeys(nextTargetKeys)
  }

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys)
    console.log('targetSelectedKeys:', targetSelectedKeys)
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const onScroll = (
    direction: TransferDirection,
    e: React.SyntheticEvent<HTMLUListElement>
  ) => {
    console.log('direction:', direction)
    console.log('target:', e.target)
  }

  return (
    <Modal
      title='Add New Formula'
      open
      onCancel={props.hide}
      onOk={onClickSave}
      okButtonProps={{
        loading: insertsLoading,
      }}
      width={600}
    >
      <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <FormInput name='title' label={'Formula Heading'} propsinput={{}} />
        <FormSelect
          name='itemType'
          label='Mathematical Operations'
          propsselect={{ options: MathematicalOperations }}
        />

        <Divider dashed />
        <Transfer
          dataSource={data?.groups}
          titles={['Source', 'Operands']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          onScroll={onScroll}
          render={(item) => item?.title ?? ''}
          listStyle={{
            width: '100%',
            height: 300,
          }}
        />
      </Form>
    </Modal>
  )
}
