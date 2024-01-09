import { ArrowRightOutlined, FieldTimeOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Col,
  Descriptions,
  Modal,
  Row,
  Skeleton,
  Space,
  Table,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import styled from 'styled-components'
import { ArPaymentPostingItems } from '@/graphql/gql/graphql'

const FIND_ONE_CREDIT_NOTE = gql`
  query ($id: UUID) {
    findOneCreditNote(id: $id) {
      id
      creditNoteNo
      arCustomer {
        customerName
      }
      creditNoteDate
      totalAmountDue
    }
  }
`

const FIND_ALL_ITEMS = gql`
  query ($id: UUID) {
    paymentItems: findCreditNoteItemsByCNId(id: $id) {
      id
      itemName
      itemType
      arCreditNote {
        creditNoteDate
      }
      totalAmountDue
    }
  }
`

interface CreditNoteViewingI {
  hide: (value: any) => void
  id: string
}
export default function CreditNoteViewing(props: CreditNoteViewingI) {
  const router = useRouter()
  const { id } = props
  const { data: cnData, loading: findOnePNLoading } = useQuery(
    FIND_ONE_CREDIT_NOTE,
    {
      variables: {
        id,
      },
    }
  )

  const { data: pnItemsData, loading: pnItemsLoading } = useQuery(
    FIND_ALL_ITEMS,
    {
      variables: {
        id,
      },
    }
  )

  const { creditNoteNo, arCustomer, creditNoteDate, totalAmountDue } =
    cnData?.findOneCreditNote ?? {}

  const [messageApi, contextHolder] = message.useMessage()

  const columns: ColumnsType<any> = [
    {
      title: 'DATE',
      dataIndex: ['arCreditNote', 'creditNoteDate'],
      width: 150,
      render: (text) => (text ? dayjs(text).format(' MM/DD/YYYY') : null),
    },
    {
      title: 'PARTICULARS',
      dataIndex: 'itemName',
    },
    {
      title: 'TYPE',
      dataIndex: 'itemType',
      width: 100,
    },
    {
      title: 'AMOUNT',
      dataIndex: 'totalAmountDue',
      align: 'right',
      className: 'NUMBER',
      width: 180,
      render: (text) => numeral(text).format('0,0.00'),
    },
  ]

  return (
    <Modal
      title={
        findOnePNLoading ? (
          <Space.Compact direction='vertical'>
            <Skeleton.Input active={findOnePNLoading} />
            <Skeleton.Input active={findOnePNLoading} />
          </Space.Compact>
        ) : (
          <Space.Compact direction='vertical'>
            <Typography.Title level={4}>
              <Space align='baseline'>
                <FieldTimeOutlined />
                <b>
                  <Space>Credit Note : {creditNoteNo ?? ''}</Space>
                </b>
              </Space>
            </Typography.Title>
            <Typography.Text type='secondary' italic>
              Viewing Mode Only
            </Typography.Text>
          </Space.Compact>
        )
      }
      open={true}
      onCancel={() => props?.hide(false)}
      width={'100%'}
      style={{
        top: 20,
        border: 'none',
        boxShadow: 'none',
      }}
      maskStyle={{ background: '#f2f3f4' }}
      className='full-page-modal'
      footer={<></>}
    >
      {contextHolder}
      <Space direction='vertical' style={{ width: '100%' }}>
        <Descriptions
          layout='vertical'
          column={{ xs: 1, sm: 2, md: 4, lg: 5, xl: 5, xxl: 6 }}
          size='small'
        >
          <Descriptions.Item label='To Client' span={24}>
            {arCustomer?.customerName}
          </Descriptions.Item>
          <Descriptions.Item label='Credit Note Date'>
            {dayjs(creditNoteDate).format('DD MMM, YYYY')}
          </Descriptions.Item>

          <Descriptions.Item label='Amount'>
            {numeral(totalAmountDue).format('0,0.00')}
          </Descriptions.Item>
        </Descriptions>
        <InvoiceTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={pnItemsData?.paymentItems ?? []}
            size='small'
            loading={pnItemsLoading}
            scroll={{ x: 1200 }}
            pagination={false}
          />
        </InvoiceTableCSS>
        <Row style={{ marginTop: 25 }}>
          <Col flex={20}></Col>
        </Row>
      </Space>
    </Modal>
  )
}

const InvoiceTableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: teal !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`
