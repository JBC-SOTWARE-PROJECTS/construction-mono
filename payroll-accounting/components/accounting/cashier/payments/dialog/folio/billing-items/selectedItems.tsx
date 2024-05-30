import { FormInput } from "@/components/common"
import { SearchOutlined } from "@ant-design/icons"
import { Form, Table } from "antd"
import { Dispatch } from "react"
import { BillingItemAction, BillingItemState } from "."
import { getSelectedItemsColumn } from "./utils"
import { BillingItem } from "@/graphql/gql/graphql"
import { TableCSS } from "@/components/common/custom/styles"

interface Props {
  state: BillingItemState
  dispatch: Dispatch<BillingItemAction>
}

const TerminalWindowSelectedBillingItem = (props: Props) => {
  const { state } = props

  const onDelete = (id: string) => {
    const newSelItems = { ...state.selectedItems }
    delete newSelItems[id]
    props.dispatch({ type: "set-selectedItems", payload: newSelItems })
    const index = state.selectedKeys.findIndex((row: string) => row == id)
    if (index >= 0) {
      const newList = [...state.selectedKeys]
      newList.splice(index, 1)
      props.dispatch({ type: "set-selectedKeys", payload: newList })
    }
  }

  const onGenerateRows = (selectedItems: any) => {
    console.log(selectedItems, "selectedItems")
    const selItems = { ...selectedItems }
    const items: BillingItem[] = []
    Object.keys(selItems).forEach((key) => items.push(selItems[key]))
    return items
  }

  return (
    <>
      {/* <Form autoComplete="" onFinish={onSearch}>
        <FormInput
          name="filter"
          propsinput={{
            suffix: <SearchOutlined />,
            autoComplete: "off",
            placeholder: "Search folio no or patient here ...",
          }}
        />
      </Form> */}
      <TableCSS>
        <Table
          rowKey="id"
          loading={false}
          size="small"
          columns={getSelectedItemsColumn(onDelete)}
          dataSource={onGenerateRows(state.selectedItems)}
          scroll={{ x: 1200 }}
        />
      </TableCSS>
    </>
  )
}

export default TerminalWindowSelectedBillingItem
