import { FormInput, FormTextArea } from '@/components/common'
import { Col, Form, FormInstance, Row } from 'antd'
import { ContactStateI } from '.'
import { ArCustomers } from '@/graphql/gql/graphql'

interface InformationI {
  form: FormInstance<any>
  state: ContactStateI
  dispatch: any
  customer?: ArCustomers
}
export default function SummaryAddress(props: InformationI) {
  const { state, customer } = props
  return (
    <Form
      name='information-form'
      form={props.form}
      layout='vertical'
      autoComplete='off'
      disabled={state.informationDisable}
      initialValues={{ ...customer }}
    >
      <Row gutter={[8, 8]} wrap>
        <Col flex='100%'>
          <FormInput label='Contact Person' name='contactPerson' />
        </Col>
        <Col flex='50%'>
          <FormInput label='Contact No' name='contactNo' />
        </Col>
        <Col flex='50%'>
          <FormInput label='Contact Email' name='contactEmail' />
        </Col>
        <Col flex='100%'>
          <FormTextArea label='Client Full Address' name='address' />
        </Col>
      </Row>
    </Form>
  )
}
