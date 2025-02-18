import { Divider, Modal, Tabs } from "antd"
import { useEffect, useReducer, useState } from "react"
import FolioItemList from "./items"
import TerminalWindowSelectedBillingItem from "./selectedItems"
import { BillingItem } from "@/graphql/gql/graphql"

interface ModalProps {
  folioItems: any
  hide: (selectedItems?: BillingItem[]) => void
  billing: string
  startDate: string
}

export type SelItemType = { [key: string]: BillingItem }
export interface BillingItemState {
  defaultItems: any
  selectedItems: SelItemType
  selectedKeys: string[]
}

export type BillingItemAction =
  | { type: "set-defaultItems"; payload: string[] }
  | { type: "set-selectedItems"; payload: { [key: string]: BillingItem } }
  | { type: "set-selectedKeys"; payload: string[] }
  | { type: "set-reset"; payload: null }
  | { type: "set-demo"; payload: any }

const initialValues = {
  defaultItems: [],
  selectedItems: {},
  selectedKeys: [],
}

const reducer = (
  state: BillingItemState,
  { type, payload }: BillingItemAction
) => {
  switch (type) {
    case "set-defaultItems":
      return { ...state, defaultItems: payload }
    case "set-selectedItems":
      return { ...state, selectedItems: payload }
    case "set-selectedKeys":
      return { ...state, selectedKeys: payload }
    case "set-reset":
      return { defaultItems: [], selectedItems: {}, selectedKeys: [] }
    default:
      return state
  }
}

export default function TerminalWindowFolioItemListDialog(props: ModalProps) {
  console.info("Billing Items ...")
  const [state, dispatch] = useReducer(reducer, initialValues)

  useEffect(() => {
    const newDefault: string[] = []
    Object.keys(props.folioItems).forEach((k) => {
      const folioItemType = props?.folioItems[k] ?? ([] as BillingItem[])
      if (folioItemType.length > 0) {
        folioItemType.map((f: BillingItem) => newDefault.push(f.id))
      }
    })
    dispatch({ type: "set-defaultItems", payload: newDefault })
    return () => {
      dispatch({ type: "set-reset", payload: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.folioItems])

  const onSubmit = () => {
    const items: BillingItem[] = []
    const selItems = { ...state.selectedItems }
    Object.keys(selItems).forEach((key) => items.push(selItems[key]))
    props.hide(items)
  }

  const onCancel = () => {
    props.hide()
  }

  return (
    <Modal
      title="Billing Details for Folio #"
      open
      onOk={onSubmit}
      onCancel={() => onCancel()}
      width="100%"
      okText="Select"
      style={{ top: 20 }}
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
      // footer={null}
    >
      <Tabs
        size="small"
        tabPosition="top"
        destroyInactiveTabPane
        items={[
          {
            key: "ROOMBOARD",
            label: `Rooms and Board`,
            children: (
              <FolioItemList
                itemType="Roomboard"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "MEDICINES",
            label: `Drugs and Medicines`,
            children: (
              <FolioItemList
                itemType="Medicines"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "SUPPLIES",
            label: `Supplies`,
            children: (
              <FolioItemList
                itemType="Supplies"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "DIAGNOSTICS",
            label: `Laboratory and Diagnostics`,
            children: (
              <FolioItemList
                itemType="Diagnostics"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "CATHLAB",
            label: `Catheterization Laboratory`,
            children: (
              <FolioItemList
                itemType="Cathlab"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "ORFEE",
            label: `Operating room`,
            children: (
              <FolioItemList
                itemType="Orfee"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
          {
            key: "PF",
            label: `Professional Fee`,
            children: (
              <FolioItemList itemType="Pf" {...{ ...props, dispatch, state }} />
            ),
          },
          {
            key: "OTHERS",
            label: `Miscellaneous`,
            children: (
              <FolioItemList
                itemType="Others"
                {...{ ...props, dispatch, state }}
              />
            ),
          },
        ]}
      />
      <Divider orientation="left">Selected Item(s)</Divider>
      <TerminalWindowSelectedBillingItem {...{ dispatch, state }} />
    </Modal>
  )
}
