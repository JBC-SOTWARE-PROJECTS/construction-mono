import { Header } from '@/components/common/custom-components/styled-html'
import {
  FormDatePicker,
  FormInputNumber,
  FormSelect,
  FormTextarea,
} from '@/components/common/form-styled'
import FormInput from '@/components/common/form-styled/form-input'
import { Col, Divider, Form, Modal, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'

interface CreateFixedAssetI {
  hide: () => void
}

export default function CreateFixedAsset(props: CreateFixedAssetI) {
  const [form] = useForm()

  return (
    <Modal
      title={<Header $bold='bolder'>Fixed Asset Item</Header>}
      open
      onCancel={props.hide}
      okText='Save'
    >
      <Form form={form} layout='vertical'>
        <Row gutter={[8, 8]}>
          <Col flex='50%'>
            <FormInput name='serialNo' label='Serial No.' bold />
          </Col>
          <Col flex='50%'>
            <FormSelect
              name='serialNo'
              label='Asset name'
              bold
              propsselect={{}}
            />
          </Col>
          <Col flex='100%'>
            <FormTextarea name='description' label='Description' bold />
          </Col>
        </Row>
        <Divider dashed style={{ marginBottom: 8 }} />
        <Row gutter={[8, 8]}>
          <Col flex='50%'>
            <FormInputNumber name='purchasePrice' label='Purchase price' bold />
          </Col>
          <Col flex='50%'>
            <FormInputNumber name='salvageValue' label='Salvage value' bold />
          </Col>
          <Col flex='50%'>
            <FormDatePicker
              name='depreciationStartDate'
              label='Depreciation start date'
              bold
            />
          </Col>
          <Col flex='50%'>
            <FormInputNumber name='usefulLife' label='Useful life' bold />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
