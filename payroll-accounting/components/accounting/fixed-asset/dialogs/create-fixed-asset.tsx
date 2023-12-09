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
        <Divider dashed orientation='left' orientationMargin={0} plain>
          Details
        </Divider>
        <Row gutter={[8, 8]}>
          <Col flex='50%'>
            <FormInput name='serialNo' label='Serial No.' bold />
          </Col>
          <Col flex='50%'>
            <FormInput name='assetNo' label='Asset No.' bold />
          </Col>
          <Col flex='100%'>
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
          <Col flex='100%'>
            <FormSelect name='officeId' label='Office' bold propsselect={{}} />
          </Col>
          <Col flex='50%'>
            <FormInputNumber name='purchasePrice' label='Purchase price' bold />
          </Col>
          <Col flex='50%'>
            <FormDatePicker name='purchaseDate' label='Purchase date' bold />
          </Col>
        </Row>
        <Divider dashed orientation='left' orientationMargin={0} plain>
          Depreciation details
        </Divider>
        <Row gutter={[8, 8]}>
          <Col flex='50%'>
            <FormDatePicker
              name='depreciationStartDate'
              label='Depreciation start date'
              bold
            />
          </Col>
          <Col flex='50%'>
            <FormSelect
              label='Depreciation Method'
              name='depreciationMethod'
              bold
              propsselect={{}}
            />
          </Col>
          <Col flex='50%'>
            <FormInputNumber name='salvageValue' label='Salvage value' bold />
          </Col>
          <Col flex='50%'>
            <FormInputNumber
              name='usefulLife'
              label='Useful life (Years)'
              bold
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col flex='100%'>
            <FormInputNumber
              name='accumulatedDepreciation'
              label='Accumulated Depreciation as at 31 Dec 2022'
              bold
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
