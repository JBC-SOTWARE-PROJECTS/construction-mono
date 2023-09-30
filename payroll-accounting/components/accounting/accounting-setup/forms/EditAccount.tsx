import { FormInput } from '@/components/common'
import FormCheckBox from '@/components/common/formCheckBox/formCheckBox'
import FormSelect from '@/components/common/formSelect/formSelect'
import { SubAccountSetup } from '@/graphql/gql/graphql'
import { BookOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'

interface AddAccountProps {
  hide: (hideProps: any) => {}
  row?: any
}

const EditAccount = (props: AddAccountProps) => {
  const [form] = Form.useForm()

  console.log('EditAccount', props.row)
  const handleSubmmit = (fields: SubAccountSetup) => {
    // console.log("payload for add", props.itemid, fields.id)
  }

  return (
    <>
      <Modal
        title={'Edit Account Setup'}
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
          initialValues={{ ...props.row }}
          onFinish={handleSubmmit}
          autoComplete='off'
        >
          <FormInput
            label='Parent Account'
            name={['journalAccount', 'motherAccount', 'code']}
            propsinput={{
              prefix: <BookOutlined />,
              placeholder: 'Parent Account',
              disabled: true,
            }}
          />
          <FormSelect
            label='First Child Account'
            name='id'
            propsselect={{
              options: [],
            }}
          />
          <FormSelect
            label='Second Child Account'
            name='id'
            propsselect={{
              options: [],
            }}
          />
          <FormSelect
            label='Source value'
            name='sourceColumn'
            propsselect={{
              options: [],
            }}
          />
          <FormCheckBox
            name='attrInactive'
            valuePropName='checked'
            checkBoxLabel='IsMultiple'
            propscheckbox={{
              defaultChecked: false,
            }}
          />
        </Form>
      </Modal>
    </>
  )
}

export default EditAccount
