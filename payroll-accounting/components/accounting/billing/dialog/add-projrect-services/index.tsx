import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons"
import {
  Alert,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd"
import { getProjectServicesCol } from "./utils"
import { GET_PROJECT_COST } from "@/graphql/inventory/project-queries"
import { useQuery } from "@apollo/client"
import { useState } from "react"

import type { TableColumnsType, TableProps } from "antd"
import { ProjectCost } from "@/graphql/gql/graphql"

type TableRowSelection<T> = TableProps<T>["rowSelection"]

interface AddProjectServicesProps {
  hide: (params?: any) => void
  id: string
  billingItems: string[]
}
export function AddProjectServices(props: AddProjectServicesProps) {
  const { data, loading, refetch } = useQuery(GET_PROJECT_COST, {
    variables: {
      filter: "",
      id: props?.id,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<ProjectCost> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Modal
      open
      onCancel={props.hide}
      width={1000}
      title={<b>{`Project's Bill of Quantities`}</b>}
    >
      <Row gutter={[8, 8]}>
        <Col flex="100%">
          <Alert
            description={
              <Typography.Text>
                <b>Note:</b> Adding project services to billing affects{" "}
                <Typography.Text mark italic strong>
                  Project Work Accomplishment&apos;s records
                </Typography.Text>
                . Changes made here reflect in current{" "}
                <Typography.Text mark italic strong>
                  Project Work Accomplishment
                </Typography.Text>
                . Ensure accurate billing entries for consistency.
              </Typography.Text>
            }
            type="warning"
          />
        </Col>
        <Col flex="100%">
          <TableNoBorderRadCSS>
            <PageFilterContainer
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
            />
            <Table
              rowSelection={rowSelection}
              rowKey="id"
              size="small"
              columns={getProjectServicesCol()}
              dataSource={data?.pCostByList ?? []}
              scroll={{ x: 1500 }}
            />
          </TableNoBorderRadCSS>
        </Col>
      </Row>
    </Modal>
  )
}
