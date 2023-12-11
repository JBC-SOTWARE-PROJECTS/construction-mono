import { Header } from '@/components/common/custom-components/styled-html'
import {
  FormDatePicker,
  FormInputNumber,
  FormSelect,
  FormTextarea,
} from '@/components/common/form-styled'
import FormInput from '@/components/common/form-styled/form-input'
import { DepreciationMethods } from '@/constant/fixed-asset'
import { FixedAssetItems } from '@/graphql/gql/graphql'
import { useGetFixedAssetItems } from '@/hooks/fixed-asset'
import { useGetCompanyActiveOffices } from '@/hooks/public'
import { Col, Divider, Form, Modal, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import dayjs from 'dayjs'

interface CreateFixedAssetI {
  hide: () => void
  record: FixedAssetItems
}

export default function CreateFixedAsset(props: CreateFixedAssetI) {
  const { record } = props
  const [form] = useForm()

  const itemList = useGetFixedAssetItems()
  const companyOffices = useGetCompanyActiveOffices()

  return (
    <Modal
      title={<Header $bold='bolder'>Fixed Asset Item</Header>}
      open
      onCancel={props.hide}
      okText='Save'
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...record,
          purchaseDate: record?.purchaseDate
            ? dayjs(record?.purchaseDate)
            : dayjs(),
          depreciationStartDate: record?.depreciationStartDate
            ? dayjs(record?.depreciationStartDate)
            : dayjs(),
          officeId: record?.office?.id ?? '',
        }}
      >
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
              name='itemId'
              label='Asset name'
              bold
              propsselect={{
                options: itemList?.data?.map((item) => ({
                  label: item?.descLong,
                  value: item?.id,
                  key: item?.id,
                })),
              }}
            />
          </Col>
          <Col flex='100%'>
            <FormTextarea name='description' label='Description' bold />
          </Col>
          <Col flex='100%'>
            <FormSelect
              name='officeId'
              label='Office'
              bold
              propsselect={{
                options: companyOffices?.data?.map((item) => ({
                  label: item?.officeDescription,
                  value: item?.id,
                  key: item?.id,
                })),
              }}
            />
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
              propsselect={{ options: DepreciationMethods }}
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
