import PageFilterContainer from "@/components/common/custom-components/page-filter-container"
import { TableNoBorderRadCSS } from "@/components/common/utils/table-utils"
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons"
import {
  Alert,
  Button,
  Card,
  Divider,
  Result,
  Segmented,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd"
import type { TableProps } from "antd"
import { CalculationType, DeductionActionType, DeductionState } from "."
import { Dispatch } from "react"
import { getProjectDeductionCol } from "./utils"
import { useDialog } from "@/hooks"
import { BillingItemsCharges } from "../billing-items-charges"
import { BillingItem } from "@/graphql/gql/graphql"

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

interface DeductionsTableProps {
  state: DeductionState
  dispatch: Dispatch<DeductionActionType>
  id: string
}

export default function DeductionsTable(props: DeductionsTableProps) {
  const billingItemChargesDialog = useDialog(BillingItemsCharges)

  const onHandleChangeCalculation = (value?: CalculationType) => {
    props.dispatch({
      type: "set-calculation-type",
      payload: value ?? "CUSTOMIZE",
    })
  }

  const onHandleAddDeductionItems = () => {
    const billingItems = (props?.state?.deductionItems ?? []).map(
      (ded) => ded.id
    )
    billingItemChargesDialog(
      {
        id: props.id,
        billingItems,
      },
      (selected: BillingItem[]) => {
        console.log(selected, "selected")
        if (selected)
          props.dispatch({
            type: "set-deduction-items",
            payload: selected ?? [],
          })
      }
    )
  }

  const onHandleDelete = (id: string) => {
    const newItems = [...props.state?.deductionItems]
    const index = props.state?.deductionItems.findIndex((ded) => ded.id == id)
    newItems.splice(index, 1)

    props.dispatch({
      type: "set-deduction-items",
      payload: newItems,
    })
  }

  return (
    <Card
      style={{ height: "100%" }}
      extra={
        <Space>
          <Segmented
            value={props.state.calculationType}
            options={["AUTO", "CUSTOMIZE"]}
            onChange={(value) => {
              onHandleChangeCalculation(value as CalculationType) // string
            }}
          />
        </Space>
      }
    >
      {props.state.calculationType == "AUTO" ? (
        <Result
          status="info"
          title={
            <Typography.Text>
              Charged items and services will be automatically prorated when
              deductions are applied <br />
              Your final total will be adjusted accordingly. <br />
              Click the button to customize deduction items.
            </Typography.Text>
          }
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => onHandleChangeCalculation("CUSTOMIZE")}
            >
              Customize
            </Button>
          }
        />
      ) : (
        <>
          <PageFilterContainer
            rightSpace={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusCircleFilled />}
                  onClick={onHandleAddDeductionItems}
                >
                  Add Items/Service
                </Button>
              </Space>
            }
          />
          <TableNoBorderRadCSS>
            <Table
              rowKey="id"
              size="small"
              columns={getProjectDeductionCol(onHandleDelete)}
              dataSource={props.state.deductionItems}
            />
          </TableNoBorderRadCSS>
        </>
      )}
    </Card>
  )
}
