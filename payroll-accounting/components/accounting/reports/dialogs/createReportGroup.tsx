import { FormSelect } from '@/components/common'
import FormInput from '@/components/common/formInput/formInput'
import { ProfitAndLossItemTypes, normalSide } from '@/constant/financial-setup'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

const ITEMS_MUTATION_QUERY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayoutItem(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`
interface CreateReportGroup {
  reportType: string
  reportsLayoutId: string
}
export default function CreateReportGroup(props: any) {
  const { reportType, reportsLayoutId } = props
  const [form] = useForm()

  const [onInserts, { loading: insertsLoading }] = useMutation(
    ITEMS_MUTATION_QUERY,
    {
      onCompleted: () => {},
    }
  )

  const onClickSave = () => {
    const { title, normalSide, itemType } = form.getFieldsValue()
    onInserts({
      variables: {
        id: null,
        fields: {
          reportsLayoutId,
          account: null,
          reportLayoutItemsParent: null,
          orderNo: 0,
          title,
          normalSide,
          itemType,
          isGroup: true,
          hasTotal: true,
        },
      },
      onCompleted: () => {
        props.hide()
      },
    })
  }

  return (
    <Modal
      title='Add New Group'
      open
      onCancel={props.hide}
      onOk={onClickSave}
      okButtonProps={{
        loading: insertsLoading,
      }}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <FormInput name='title' label={'Row Heading'} propsinput={{}} />
        {reportType == 'PROFIT_AND_LOSS' && (
          <FormSelect
            name='itemType'
            label='Item Type'
            propsselect={{ options: ProfitAndLossItemTypes }}
          />
        )}

        <FormSelect
          name='normalSide'
          label='Normal Side'
          propsselect={{ options: normalSide }}
        />
      </Form>
    </Modal>
  )
}
