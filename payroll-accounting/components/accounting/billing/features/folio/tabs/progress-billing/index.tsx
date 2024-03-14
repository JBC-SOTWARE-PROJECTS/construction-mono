import { AddProjectServices } from "@/components/accounting/billing/dialog/add-projrect-services"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { GET_BILLING_ITEMS } from "@/graphql/billing/queries"
import { Billing, BillingItem } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { currency } from "@/utility/constant"
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper"
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useQuery } from "@apollo/client"
import { Alert, Button, Input, Space, Table, Tag, Typography } from "antd"

import type { TableColumnsType } from "antd"
import styled from "styled-components"
import { getBillingItemColumns } from "./utils"
import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

type FolioBillingItemType = "SERVICE" | "DEDUCTIONS" | "PAYMENTS"

interface FolioProgressBillingProps {
  billing: Billing
  type: FolioBillingItemType
}

export default function FolioProgressBilling(
  props?: FolioProgressBillingProps
) {
  const projectServicesDialog = useDialog(AddProjectServices)

  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: "",
      id: props?.billing?.id,
      type: props?.type,
    },
  })

  const onInsertService = () => {
    // const billingItems = (data?.billingItemByParentType ?? []).map((item:BillingItem)=> item?.projectWorkAccomplishmentItemId ? item?.)
    projectServicesDialog({ id: props?.billing?.project?.id }, () => {})
  }

  return (
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
              onClick={onInsertService}
            >
              Project Services
            </Button>
          </Space>
        }
      />
      <Table
        rowKey={"id"}
        size="small"
        columns={getBillingItemColumns()}
        loading={loading}
        dataSource={data?.billingItemByParentType ?? []}
        scroll={{ x: 1500, y: 300 }}
      />
    </TableNoBorderRadCSS>
  )
}
