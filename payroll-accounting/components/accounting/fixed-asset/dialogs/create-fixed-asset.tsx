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
import { useMutation } from '@apollo/client'
import { Col, Divider, Form, Modal, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import dayjs from 'dayjs'
import { UPSERT_FIXED_ASSET } from '../others/gql'

interface CreateFixedAssetI {
  hide: () => void
  record: FixedAssetItems
}

export default function CreateFixedAsset(props: CreateFixedAssetI) {
  const { record } = props
  const [form] = useForm()

  const [onUpdate, { loading }] = useMutation(UPSERT_FIXED_ASSET)

  const itemList = useGetFixedAssetItems()
  const companyOffices = useGetCompanyActiveOffices()

  const onSave = (values: FixedAssetItems) => {
    onUpdate({
      variables: {
        id: record?.id,
        fields: {
          ...values,
        },
      },
      onCompleted: () => props.hide(),
    })
  }

  return (
    <Modal
      title={<Header $bold='bolder'>Fixed Asset Item</Header>}
      open
      onCancel={props.hide}
      onOk={() => form.submit()}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
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
        onFinish={onSave}
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
        {record?.isBeginningBalance && (
          <Row gutter={[8, 8]}>
            <Col flex='100%'>
              <FormInputNumber
                name='accumulatedDepreciation'
                label='Accumulated Depreciation as of 31 Dec 2023'
                bold
              />
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  )
}
