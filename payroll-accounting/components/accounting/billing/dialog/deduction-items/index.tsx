import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons"
import { useQuery } from "@apollo/client"
import { Button, Col, Input, Modal, Row, Space, Table, Typography } from "antd"

import { DEDUCTION_DETAILS, GET_BILLING_ITEMS } from "@/graphql/billing/queries"
import type { TableProps } from "antd"
import { ColumnsType } from "antd/es/table"
import { BillingItem, DiscountDetails } from "@/graphql/gql/graphql"
import { currency } from "@/utility/constant"
import { NumberFormater } from "@/utility/helper"
import numeral from "numeral"

type TableRowSelection<T> = TableProps<T>["rowSelection"]

interface DeductionItemsProps {
  hide: (params?: any) => void
  id: string
  billingItems: string[]
}
export function DeductionItems(props: DeductionItemsProps) {
  const { data, loading, refetch } = useQuery(DEDUCTION_DETAILS, {
    variables: {
      id: props?.id,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  })

  const columns: ColumnsType<DiscountDetails> = [
    {
      title: "Record No.",
      width: 100,
      dataIndex: ["refBillItem", "recordNo"],
      fixed: "left",
    },
    {
      title: "Description",
      dataIndex: ["refBillItem", "description"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
      width: 150,
      fixed: "right",
      render: (subTotal) => numeral(subTotal).format("0,0.00"),
    },
  ]

  return (
    <Modal
      open
      onCancel={props.hide}
      footer={null}
      width={1000}
      title={<b>{`Project's Deduction details`}</b>}
    >
      <Row gutter={[8, 8]}>
        <Col flex="100%">
          <TableNoBorderRadCSS>
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={data?.deductionItemsById ?? []}
              scroll={{ x: 1500 }}
              summary={(pageData) => {
                let sum = 0

                pageData.forEach(({ amount }) => {
                  sum += amount
                })

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} />
                      <Table.Summary.Cell index={2} align="right">
                        <Typography.Text type="danger">
                          {numeral(sum).format("0,0.00")}
                        </Typography.Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
            />
          </TableNoBorderRadCSS>
        </Col>
      </Row>
    </Modal>
  )
}
