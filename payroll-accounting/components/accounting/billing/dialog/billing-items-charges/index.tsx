import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { useQuery } from "@apollo/client"
import { Col, Modal, Pagination, Row, Table } from "antd"
import { useState } from "react"
import { getProjectServicesCol } from "./utils"

import {
  GET_BILLING_ITEMS,
  GET_BILLING_ITEMS_PAGE,
} from "@/graphql/billing/queries"
import { BillingItem } from "@/graphql/gql/graphql"
import type { TableProps } from "antd"

type TableRowSelection<T> = TableProps<T>["rowSelection"]

interface BillingItemsChargesProps {
  hide: (params?: any) => void
  id: string
  billingItems: string[]
}
export function BillingItemsCharges(props: BillingItemsChargesProps) {
  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS_PAGE, {
    variables: {
      id: props?.id,
      page: 0,
      size: 10,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  })

  const [selected, setSelected] = useState<BillingItem[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    props.billingItems ?? []
  )

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: any[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelected(selectedRows)
  }

  const rowSelection: TableRowSelection<BillingItem> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: BillingItem) => ({
      disabled:
        (props?.billingItems ?? []).includes(record.id) ||
        record.remainingBalance <= 0, // Column configuration not to be checked
    }),
  }

  const onHandleAdd = () => {
    props.hide(selected)
  }

  return (
    <Modal
      open
      onOk={() => onHandleAdd()}
      onCancel={() => props.hide()}
      okText="Add"
      width={1000}
      title={<b>{`Project's Progress Billing items`}</b>}
    >
      <Row gutter={[8, 8]}>
        <Col flex="100%">
          <TableNoBorderRadCSS>
            <Table
              loading={loading}
              rowSelection={rowSelection}
              rowKey="id"
              size="small"
              columns={getProjectServicesCol()}
              dataSource={data?.billingItemPage?.content ?? []}
              scroll={{ x: 1500 }}
              footer={() => (
                <Pagination
                  current={data?.billingItemPage?.number + 1}
                  showSizeChanger={false}
                  pageSize={10}
                  responsive={true}
                  total={data?.billingItemPage?.totalElements}
                  onChange={(e) => {
                    refetch({ page: e - 1 })
                  }}
                />
              )}
            />
          </TableNoBorderRadCSS>
        </Col>
      </Row>
    </Modal>
  )
}
