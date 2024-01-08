import {
  FormDatePicker,
  FormDateRange,
  FormInput,
  FormSelect,
} from '@/components/common'
import { GuarantorBillingItemSearchFilter } from '@/constant/accountReceivables'
import {
  ADD_INVOICE_CLAIMS_ITEMS,
  CLAIMS_ITEMS,
  CLAIMS_TOTAL,
  FOLIO,
  PATIENTS,
} from '@/graphql/accountReceivables/invoices'
import { ArInvoice, BillingItem } from '@/graphql/gql/graphql'
import {
  CaretDownOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import moment from 'moment'
import numeral from 'numeral'
import { number } from 'prop-types'
import React, { useState } from 'react'
const { Search } = Input

interface ExtendedBillingItem extends BillingItem {
  amount: number
}

interface GuarantorClaimsParams {
  companyId: string
  filter: string
  filterType: string
  startDate: string
  endDate: string
  page: number
}

const GuarantorClaims = (props: {
  id: string
  customerRefId: string
  hide: any
}) => {
  const { id, customerRefId, hide } = props
  const [form] = Form.useForm()

  const [state, seState] = useState<any[]>([])
  const [onLoadClaims, { loading, data, refetch, fetchMore }] =
    useLazyQuery(CLAIMS_ITEMS)

  const [
    onLoadClaimsTotal,
    {
      loading: loadingTotal,
      data: dataTotal,
      refetch: refetchTotal,
      fetchMore: fetchMoreTotal,
    },
  ] = useLazyQuery(CLAIMS_TOTAL)

  const { content: dataSource, page: number } = data?.getArAccountsItems ?? {
    content: [],
    page: 0,
  }
  const { totalElements } = dataTotal?.getArAccountsItemsTotal ?? {
    number: 0,
    totalElements: 0,
  }

  const [onInsertClaims, { loading: loadingInsert }] = useMutation(
    ADD_INVOICE_CLAIMS_ITEMS,
    {
      onCompleted: ({ addInvoiceClaimsItem }) => {
        const { response, message: messageText, success } = addInvoiceClaimsItem
        if (!success) message.error(messageText)

        refetch()
      },
    }
  )

  const {
    data: patientData,
    loading: patientLoading,
    refetch: patientRefetch,
  } = useQuery(PATIENTS, {
    variables: { filter: '' },
  })

  const { patients } = patientData || { patients: {} }
  const { content: patientsOpt } = patients || { content: [] }

  const [onLoadFolio, { loading: folioLoading, data: folioData }] =
    useLazyQuery(FOLIO)

  const { folio: folioOpt } = folioData || { folio: [] }

  const onHandleAddItem = (billingItemId: string) => {
    onInsertClaims({
      variables: {
        billingItemId,
        invoiceId: id,
      },
      onCompleted: ({
        addInvoiceClaimsItem: { success, response, message: messageText },
      }) => {
        if (!success) message.error(messageText)
        if (response?.id) seState([...state, { ...response }])
        refetch()
      },
    })
  }

  console.log(state, 'state')

  const columns: ColumnsType<ExtendedBillingItem> = [
    {
      title: 'Folio No',
      width: 30,
      dataIndex: 'billingNo',
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Record No',
      dataIndex: 'recordNo',
      align: 'center',
      width: 35,
    },
    {
      title: 'Billing Date',
      dataIndex: 'transactionDate',
      align: 'center',
      width: 40,
    },
    {
      title: 'Particulars',
      dataIndex: 'patient',
      width: 90,
    },
    {
      title: 'Claim Description',
      dataIndex: 'description',
      width: 150,
    },
    {
      title: 'Project Reference',
      dataIndex: 'approvalCode',
      width: 55,
    },
    {
      title: 'Claim Amount',
      dataIndex: 'amount',
      align: 'right',
      fixed: 'right',
      width: 45,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 20,
      render: (text) => (
        <Button
          type='link'
          icon={<PlusCircleOutlined />}
          size='large'
          loading={loadingInsert}
          onClick={(e) => onHandleAddItem(text)}
        />
      ),
    },
  ]

  const handleLoadMore = (page: number) => {
    refetch({ page: page - 1 })
    // fetchMore({
    //   variables: { page: page - 1 }, // Calculate the new offset
    //   updateQuery: (prevResult, { fetchMoreResult }) => {
    //     if (!fetchMoreResult) return prevResult

    //     return {
    //       billingItem: {
    //         ...prevResult.billingItem,
    //         ...fetchMoreResult.billingItem,
    //       },
    //     }
    //   },
    // })
  }

  const onHandleSelectPatient = (patientId: string) => {
    onLoadFolio({
      variables: {
        patientId,
      },
    })
  }

  const onHandleSearchPatient = (filter: string) => {
    patientRefetch({ filter })
  }

  const onHandleFetchData = () => {
    const values = form.getFieldsValue()
    const { dateRange, filterType, filter } = values
    const variables: GuarantorClaimsParams = {
      companyId: customerRefId,
      filter: filter ?? '',
      filterType,
      startDate: dayjs(dateRange[0]).startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs(dateRange[1]).startOf('day').format('YYYY-MM-DD'),
      page: 0,
    }

    onLoadClaims({
      variables: { ...variables, size: 10 },
    })

    onLoadClaimsTotal({
      variables: { ...variables },
    })
  }

  const onHandleSearchInput = () => {
    const { filterType, filter } = form.getFieldsValue()
    refetch({
      filter,
      filterType,
    })
    refetchTotal({
      filter,
      filterType,
    })
  }

  const selectAfter = (
    <FormSelect
      name={'filterType'}
      style={{ width: 200, marginBottom: 0 }}
      propsselect={{
        options: GuarantorBillingItemSearchFilter,
        suffixIcon: <CaretDownOutlined />,
        bordered: false,
      }}
    />
  )

  return (
    <ProCard split='horizontal' ghost>
      <ProCard ghost>
        <Form
          form={form}
          layout='vertical'
          name='guarantorFilterForm'
          initialValues={{
            filterType: 'FOLIO_NO',
            dateRange: [
              dayjs().startOf('month').startOf('day'),
              dayjs().endOf('month').endOf('day'),
            ],
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <FormDateRange
                label='Date Range (Transaction Date)'
                name='dateRange'
                showpresstslist={true}
                propsrangepicker={{ style: { width: '100%' }, size: 'large' }}
              />
            </Col>
          </Row>
        </Form>
      </ProCard>

      <ProCard ghost>
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
                style={{ margin: 0 }}
                propsinput={{
                  addonBefore: selectAfter,
                  addonAfter: (
                    <Button
                      style={{ width: 180 }}
                      type='primary'
                      icon={<SyncOutlined />}
                      onClick={() => onHandleFetchData()}
                      loading={loading}
                    >
                      Fetch Data
                    </Button>
                  ),
                  suffix: <SearchOutlined />,
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
      </ProCard>

      <Divider dashed />
      <div style={{ width: '100%' }}>
        <Button
          onClick={() => hide(state)}
          style={{ float: 'right', background: '#db2828' }}
          type='primary'
        >
          Close
        </Button>
      </div>
    </ProCard>
  )
}

export default GuarantorClaims
