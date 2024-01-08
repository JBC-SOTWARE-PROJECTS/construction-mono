import {
  FormCheckBoxGroup,
  FormDateRange,
  FormSwitch,
  FormTextArea,
} from '@/components/common'
import { Fiscal } from '@/graphql/gql/graphql'
import { gql, useMutation } from '@apollo/client'
import { Checkbox, Divider, Form, List, Modal, message } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'

const options = [
  { label: 'January', value: 'lockJanuary' },
  { label: 'February', value: 'lockFebruary' },
  { label: 'March', value: 'lockMarch' },
  { label: 'April', value: 'lockApril' },
  { label: 'May', value: 'lockMay' },
  { label: 'June', value: 'lockJune' },
  { label: 'July', value: 'lockJuly' },
  { label: 'August', value: 'lockAugust' },
  { label: 'September', value: 'lockSeptember' },
  { label: 'October', value: 'lockOctober' },
  { label: 'November', value: 'lockNovember' },
  { label: 'December', value: 'lockDecember' },
]

interface CreateAccountingPeriodI {
  hide: () => void
  record: Fiscal | any
}
const UPDATE_INSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertFiscal(id: $id, fields: $fields) {
      id
    }
  }
`

export default function CreateAccountingPeriod(props: CreateAccountingPeriodI) {
  const { hide, record } = props
  const initialValues = {
    ...record,
    fiscalRange: [
      dayjs(record?.fromDate).subtract(1, 'day'),
      dayjs(record?.toDate).subtract(1, 'day'),
    ],
    fiscalMonths: [
      ...(record
        ? options.map(({ value }) => (record[value] ? value : null))
        : []),
    ],
  }

  const [form] = Form.useForm()

  const [updateInsert, { loading: resultLoading }] = useMutation(
    UPDATE_INSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        message.success('Record Successfully Updated')
        hide()
      },
    }
  )

  const onHandleClickOk = (values: any) => {
    const { fiscalRange, remarks, fiscalMonths, active } = values

    const fields: any = {
      fromDate: dayjs(fiscalRange[0]).add(1, 'day').startOf('day'),
      toDate: dayjs(fiscalRange[1]).endOf('day'),
      remarks: remarks ?? '',
      active,
    }

    if ((fiscalMonths ?? []).length > 0) {
      options.map(
        (opt) =>
          (fields[opt?.value] = fiscalMonths.includes(opt?.value) ?? false)
      )
    }

    updateInsert({
      variables: {
        id: record?.id ?? null,
        fields,
      },
    })
  }

  return (
    <Modal
      open
      title='New Fiscal Year'
      onCancel={() => props.hide()}
      okText={record?.id ? 'Save' : 'Create'}
      onOk={() => form.submit()}
      okButtonProps={{ loading: resultLoading }}
      cancelButtonProps={{ loading: resultLoading }}
    >
      <Divider />

      <Form
        form={form}
        name='form-fiscal'
        layout='vertical'
        autoComplete='off'
        initialValues={{ ...initialValues }}
      >
        <FormDateRange
          label='Fiscal Year Range'
          name='fiscalRange'
          rules={[{ required: true }]}
        />
        <FormTextArea label='Remarks' name='remarks' />

        <FormCheckBoxGroup
          label='Fiscal Months Status'
          name='fiscalMonths'
          propscheckboxgroup={{
            style: { width: '100%' },
            children: (
              <List
                size='small'
                bordered
                dataSource={options}
                style={{ width: '100%' }}
                renderItem={(item) => (
                  <List.Item
                    key={item.label}
                    actions={[<Checkbox key='lock' value={item.value} />]}
                  >
                    {item.label}
                  </List.Item>
                )}
              />
            ),
          }}
        />
      </Form>

      <Form
        form={form}
        name='form-fiscal-active'
        autoComplete='off'
        style={{ marginTop: 10 }}
        onFinish={onHandleClickOk}
        initialValues={{ ...initialValues }}
      >
        <FormSwitch name='active' label='Active' valuePropName='checked' />
      </Form>
      <Divider style={{ border: 'none' }} />
    </Modal>
  )
}
