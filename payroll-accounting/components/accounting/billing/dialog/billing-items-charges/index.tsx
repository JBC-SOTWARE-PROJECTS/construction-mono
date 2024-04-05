import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { useQuery } from "@apollo/client"
import { Col, Modal, Row, Table } from "antd"
import { useState } from "react"
import { getProjectServicesCol } from "./utils"

import { GET_BILLING_ITEMS } from "@/graphql/billing/queries"
import { BillingItem } from "@/graphql/gql/graphql"
import type { TableProps } from "antd"

type TableRowSelection<T> = TableProps<T>["rowSelection"]

interface BillingItemsChargesProps {
  hide: (params?: any) => void
  id: string
  billingItems: string[]
}
export function BillingItemsCharges(props: BillingItemsChargesProps) {
  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS, {
    variables: {
      filter: "",
      id: props?.id,
      type: "SERVICE",
      active: true,
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
      disabled: (props?.billingItems ?? []).includes(record.id), // Column configuration not to be checked
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
            {/* <PageFilterContainer
              leftSpace={
                <Space>
                  <Input
                    variant="filled"
                    placeholder="Search ..."
                    suffix={<SearchOutlined />}
                  />
                </Space>
              }
              rightSpace={
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusCircleFilled />}
                    style={{ marginRight: "16px" }}
                  >
                    Add Bill of Quantities
                  </Button>
                </Space>
              }
            /> */}
            <Table
              rowSelection={rowSelection}
              rowKey="id"
              size="small"
              columns={getProjectServicesCol()}
              dataSource={data?.billingItemByParentType ?? []}
              scroll={{ x: 1500 }}
            />
          </TableNoBorderRadCSS>
        </Col>
      </Row>
    </Modal>
  )
}
