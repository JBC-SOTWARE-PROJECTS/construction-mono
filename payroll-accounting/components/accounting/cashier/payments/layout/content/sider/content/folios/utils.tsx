import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import EditTerminalItemAmount from "@/components/accounting/cashier/payments/dialog/edit-teminal-item-amount"
import { BillingItem, BillingItemType } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { CloseCircleFilled } from "@ant-design/icons"
import { Button, Space } from "antd"
import numeral from "numeral"
import { Dispatch } from "react"
import styled from "styled-components"

interface FolioItemsProps {
  items?: BillingItem[]
  itemType: BillingItemType
  dispatch: Dispatch<TerminalWindowsAction>
}

export const FolioItems = (props: FolioItemsProps) => {
  const editAmount = useDialog(EditTerminalItemAmount)

  const onEdit = (id: string, amount: number, tmpBalance: number) => {
    editAmount({ amount, tmpBalance }, (amount: number) => {
      if (amount) {
        const newItems = [...(props?.items ?? [])]
        const index = newItems.findIndex((item) => item.id == id)
        newItems[index] = { ...newItems[index], subtotal: amount }
        props.dispatch({
          type: "set-folio-items-by-type",
          payload: { [props.itemType]: newItems },
        })
      }
    })
  }

  const onDelete = (id: string) => {
    const newItems = [...(props?.items ?? [])]
    const index = newItems.findIndex((item) => item.id == id)
    newItems.splice(index, 1)
    props.dispatch({
      type: "set-folio-items-by-type",
      payload: { [props.itemType]: newItems },
    })
  }

  return (
    <TableItems>
      <tbody>
        {(props?.items ?? []).map((items: BillingItem) => {
          console.log(items, "item")
          return (
            <tr key={items.id}>
              <td
                onClick={() =>
                  onEdit(items.id, items.subtotal, items.tmpBalance)
                }
              >
                <Title>
                  {items.recordNo}-{items.description}
                </Title>
                <Desc>
                  {items.qty} PCS @{numeral(items.price).format("0,0.00")} BAL.
                  {numeral(items.tmpBalance).format("0,0.00")}
                </Desc>
              </td>
              <TDNum
                width={100}
                onClick={() =>
                  onEdit(items.id, items.subtotal, items.tmpBalance)
                }
              >
                <Title>{numeral(items.subtotal).format("0,0.00")}</Title>
                <Desc>
                  VAT{" "}
                  {items.vatable
                    ? numeral(items.vatOutputTax).format("0,0.00")
                    : 0}
                </Desc>
              </TDNum>
              <TDAct width={30}>
                <Space.Compact size="small">
                  <Button
                    icon={<CloseCircleFilled style={{ fontSize: "15px" }} />}
                    size="small"
                    type="link"
                    style={{ color: "#9F9F9E" }}
                    onClick={() => onDelete(items.id)}
                  />
                </Space.Compact>
              </TDAct>
            </tr>
          )
        })}
      </tbody>
    </TableItems>
  )
}

const TableItems = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th,
  td {
    padding: 4px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f2f2f2;
    cursor: pointer;
  }
`

const Desc = styled.div`
  color: #78716c;
`

const Title = styled.div`
  font-weight: 500;
`

const TDNum = styled.td`
  text-align: right !important;
`

const TDAct = styled.td`
  text-align: center !important;
`
