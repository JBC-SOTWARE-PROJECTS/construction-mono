import { AddProjectServices } from "@/components/accounting/billing/dialog/add-projrect-services"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import {
  DELETE_BILLING_ITEM_BY_ID,
  GET_BILLING_ITEMS,
} from "@/graphql/billing/queries"
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
import { useMutation, useQuery } from "@apollo/client"
import { Alert, Button, Input, Space, Table, Tag, Typography } from "antd"

import type { TableColumnsType } from "antd"
import styled from "styled-components"
import { getBillingItemColumns } from "./utils"
import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { FolioTabsProps } from ".."
import { AddProjectDeductions } from "@/components/accounting/billing/dialog/add-projrect-deductions"
import { DeductionItems } from "@/components/accounting/billing/dialog/deduction-items"
import { useEffect } from "react"

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

type FolioBillingItemType = "SERVICE" | "DEDUCTIONS" | "PAYMENTS"

interface FolioDeductionsProps extends FolioTabsProps {
  type: FolioBillingItemType
}

export default function FolioDeductions(props?: FolioDeductionsProps) {
  const projectDeductionsDialog = useDialog(AddProjectDeductions)
  const deductionDetailsDialog = useDialog(DeductionItems)

  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: "",
      id: props?.billing?.id,
      type: props?.type,
    },
  })

  const [onDeleteItem, { loading: onDeleteItemLoading }] = useMutation(
    DELETE_BILLING_ITEM_BY_ID
  )

  const onInsertDeductions = () => {
    const billingItems = (data?.billingItemByParentType ?? [])
      .filter((item: BillingItem) => {
        return !!item?.projectCostId && item.status
      })
      .map((item: BillingItem) => item.projectCostId)
      .filter(Boolean)
    projectDeductionsDialog(
      {
        id: props?.billing?.project?.id,
        billingId: props?.billing?.id,
        billingItems,
      },
      () => {
        if (props?.refetch) props?.refetch()
        refetch()
      }
    )
  }

  const onDeleteBillingItem = (id: string) => {
    onDeleteItem({
      variables: {
        id,
      },
      onCompleted: ({ removeBillingItemProjectService }) => {
        if (removeBillingItemProjectService?.success) {
          refetch()
          if (props?.refetch) props?.refetch()
        }
      },
    })
  }

  const onShowDetails = (id: string) => {
    deductionDetailsDialog({ id }, () => {})
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.billing?.locked])

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
            {props?.billing?.locked && (
              <Button
                type="primary"
                icon={<PlusCircleFilled />}
                onClick={onInsertDeductions}
              >
                Add Deductions
              </Button>
            )}
          </Space>
        }
      />
      <Table
        rowKey={"id"}
        size="small"
        columns={getBillingItemColumns(onDeleteBillingItem, onShowDetails)}
        loading={loading}
        dataSource={data?.billingItemByParentType ?? []}
        scroll={{ x: 1500, y: 300 }}
      />
    </TableNoBorderRadCSS>
  )
}
