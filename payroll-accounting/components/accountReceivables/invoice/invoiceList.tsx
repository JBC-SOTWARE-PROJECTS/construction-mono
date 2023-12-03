import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import CustomModalPageHeader from '../common/modalPageHeader'
import { ProCard } from '@ant-design/pro-components'
import { FormDatePicker, FormInput, FormSelect } from '@/components/common'
import { GuarantorBillingItemSearchFilter } from '@/constant/accountReceivables'
import {
  CaretDownOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useQuery } from '@apollo/client'
import {
  FIND_ALL_INVOICE,
  FIND_ALL_INVOICE_ITEMS_BY_CUSTOMER,
} from '@/graphql/accountReceivables/invoices'
import numeral from 'numeral'
import { ColumnsType } from 'antd/es/table'
import { ArInvoice, ArInvoiceItems } from '@/graphql/gql/graphql'
import dayjs from 'dayjs'
import { styled } from 'styled-components'
import { useState } from 'react'

interface InvoiceList {
  hide: (props: boolean) => void
  customerId: string
  onHandleAddItem: (props: any, callback: () => void) => void
  selectedItems: string[]
}

export default function InvoiceList(props: InvoiceList) {
  const { hide, customerId, onHandleAddItem, selectedItems } = props
  const [form] = Form.useForm()

  const [selected, setSelected] = useState([...selectedItems])
  const {
    loading: invoiceItemLoading,
    data,
    refetch: invoiceItemRefetch,
    fetchMore,
  } = useQuery(FIND_ALL_INVOICE_ITEMS_BY_CUSTOMER, {
    variables: {
      customerId,
      invoiceId: null,
      search: '',
      page: 0,
      size: 10,
      status: 'PENDING',
    },
  })

  const { dataSource, number, totalElements } = data?.invoiceItems || {
    dataSource: [],
    number: 0,
    totalElements: 0,
  }

  const {
    loading,
    data: invoiceData,
    refetch,
  } = useQuery(FIND_ALL_INVOICE, {
    variables: {
      customerId,
      search: '',
      page: 0,
      size: 10,
      status: 'PENDING',
    },
  })

  const { content: invoiceList } = invoiceData?.findAllInvoice || {
    content: [],
  }

  const filterInvoiceOpt = invoiceList.map((invL: ArInvoice) => ({
    label: invL.invoiceNo,
    value: invL.id,
  }))

  const handleLoadMore = (page: number) => {
    fetchMore({
      variables: { page: page - 1 }, // Calculate the new offset
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult

        return {
          invoiceItems: {
            ...prevResult.invoiceItems,
            ...fetchMoreResult.invoiceItems,
          },
        }
      },
    })
  }

  const onHandleClickAdd = (record: ArInvoiceItems) => {
    onHandleAddItem(record, () => {
      setSelected([...selected, record?.id])
    })
  }

  const onHandleSearchInput = () => {
    const { filterType, filter } = form.getFieldsValue()
    // refetch({
    //   filter,
    //   filterType,
    // })
  }

  const selectAfter = (
    <Select
      defaultValue={'FOLIO_NO'}
      options={GuarantorBillingItemSearchFilter}
      size='large'
      bordered={false}
      suffixIcon={
        <CaretDownOutlined style={{ fontSize: '15px', color: 'black' }} />
      }
    />
  )

  const onHandleFetchData = () => {
    const values = form.getFieldsValue()
    // const { admissionDate, dischargedDate, patientId, billingId, filterType } =
    //   values
    // const variables: GuarantorClaimsParams = {
    //   customerId: invoice?.arCustomer?.referenceId,
    //   filter: '',
    //   filterType,
    //   billingItemType: ['DEDUCTIONSPF', 'DEDUCTIONS'],
    //   page: 0,
    //   size: 10,
    // }

    // if (admissionDate)
    //   variables.admissionDate = [
    //     dayjs(admissionDate[0]).startOf('day'),
    //     dayjs(admissionDate[1]).endOf('day'),
    //   ]
    // if (dischargedDate)
    //   variables.dischargedDate = [
    //     dayjs(dischargedDate[0]).startOf('day'),
    //     dayjs(dischargedDate[1]).endOf('day'),
    //   ]

    // if (patientId) variables.patientId = patientId
    // if (billingId) variables.billingId = billingId

    // onLoadClaims({
    //   variables: { ...variables },
    // })
  }

  const columns: ColumnsType<ArInvoiceItems> = [
    {
      title: 'Record No',
      dataIndex: 'recordNo',
      width: 40,
      fixed: 'left',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      width: 45,
    },
    {
      title: 'Folio No',
      dataIndex: 'billing_no',
      width: 40,
    },
    {
      title: 'Patient',
      dataIndex: 'patient_name',
      width: 100,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 100,
    },
    {
      title: 'Approval Code',
      dataIndex: 'approval_code',
      width: 50,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmountDue',
      width: 50,
      align: 'right',
      fixed: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      fixed: 'right',
      align: 'center',
      width: 20,
      render: (text, record) =>
        selected.includes(text) ? (
          <Button
            type='link'
            style={{ color: 'green' }}
            icon={<CheckCircleOutlined />}
            size='large'
          />
        ) : (
          <Button
            type='link'
            icon={<PlusCircleOutlined />}
            size='large'
            loading={false}
            onClick={(e) => onHandleClickAdd(record)}
          />
        ),
    },
  ]

  return (
    <Modal
      title={
        <CustomModalPageHeader
          {...{
            label: `INVOICE LIST`,
          }}
        />
      }
      open={true}
      width={'100%'}
      style={{ maxWidth: '1600px' }}
      onCancel={() => hide(false)}
      footer={
        <Button size='large' onClick={() => hide(false)}>
          Close
        </Button>
      }
    >
      <ProCard ghost split='horizontal'>
        <ProCard ghost>
          <Form
            form={form}
            layout='vertical'
            name='invoiceListFilterForms'
            initialValues={{
              filterType: 'FOLIO_NO',
            }}
          >
            <Row justify='start' gutter={{ xs: 8, sm: 16, md: 24, lg: 4 }}>
              <Col span={6}>
                <FormSelect
                  label='Filter by Invoice'
                  name='invoiceId'
                  propsselect={{
                    options: filterInvoiceOpt,
                    size: 'large',
                    suffixIcon: <CaretDownOutlined />,
                    filterOption: false,
                    style: { width: '100%' },
                    allowClear: true,
                    onClear: () => invoiceItemRefetch({ invoiceId: null }),
                    onSelect: (e) => invoiceItemRefetch({ invoiceId: e }),
                  }}
                />
              </Col>
              <Col span={6}>
                <Form.Item label='Filter by Invoice Date' name='invoiceDate'>
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    size='large'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ProCard>
        <ProCard ghost>
          <EditableTable>
            <Table
              title={() => (
                <Form
                  form={form}
                  layout='vertical'
                  name='guarantorFilterForms'
                  initialValues={{ filterType: 'FOLIO_NO' }}
                >
                  <FormInput
                    name='filter'
                    style={{ marginBottom: 0, width: '100%' }}
                    propsinput={{
                      addonBefore: selectAfter,
                      addonAfter: (
                        <Button
                          type='primary'
                          size='middle'
                          icon={<SyncOutlined />}
                          onClick={() => onHandleFetchData()}
                          loading={loading}
                        >
                          Fetch Data
                        </Button>
                      ),
                      prefix: <SearchOutlined />,
                      size: 'large',
                      allowClear: true,
                      onPressEnter: () => onHandleSearchInput(),
                    }}
                  />
                </Form>
              )}
              rowKey='id'
              columns={columns}
              loading={loading}
              dataSource={dataSource}
              size='small'
              scroll={{ x: 1500 }}
              pagination={false}
              footer={() => (
                <Pagination
                  pageSize={10}
                  responsive={true}
                  showSizeChanger={false}
                  current={number + 1}
                  total={totalElements}
                  onChange={(page) => handleLoadMore(page)}
                />
              )}
            />
          </EditableTable>
        </ProCard>
      </ProCard>
    </Modal>
  )
}

const EditableTable = styled.div`
  .ant-table-title {
    padding: 8px 0px 8px 0px !important;
  }
`
