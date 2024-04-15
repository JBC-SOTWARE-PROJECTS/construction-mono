import { AddProjectServices } from "@/components/accounting/billing/dialog/add-projrect-services"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { GET_BILLING_ITEMS } from "@/graphql/billing/queries"
import { BillingItem } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons"
import { useQuery } from "@apollo/client"
import { Button, Input, Space, Table } from "antd"

import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import { FolioTabsProps } from ".."
import { getBillingItemColumns } from "./utils"

type FolioBillingItemType = "SERVICE" | "DEDUCTIONS" | "PAYMENTS"

interface FolioProgressBillingProps extends FolioTabsProps {
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
    const billingItems = (data?.billingItemByParentType ?? [])
      .filter((item: BillingItem) => {
        return !!item?.projectCostId && item.status
      })
      .map((item: BillingItem) => item.projectCostId)
      .filter(Boolean)
    projectServicesDialog(
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
            {!props?.billing?.locked && (
              <Button
                type="primary"
                icon={<PlusCircleFilled />}
                style={{ marginRight: "16px" }}
                onClick={onInsertService}
              >
                Project Services
              </Button>
            )}
          </Space>
        }
      />
      <Table
        rowKey={"id"}
        size="small"
        columns={getBillingItemColumns(
          props?.refetch,
          refetch,
          !props?.billing?.locked
        )}
        loading={loading}
        dataSource={data?.billingItemByParentType ?? []}
        scroll={{ x: 1500, y: 300 }}
      />
    </TableNoBorderRadCSS>
  )
}
