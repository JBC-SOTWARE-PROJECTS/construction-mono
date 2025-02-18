import { FormInput } from "@/components/common"
import { useSearchPaymentItems } from "@/hooks/cashier/use-payment-item"
import { SearchOutlined, SelectOutlined } from "@ant-design/icons"
import { Button, Form, Modal, Table } from "antd"
import { ColumnProps } from "antd/es/table"
import { useEffect, useRef, useState } from "react"
import { PaymentType } from "../../data-types/types"
import numeral from "numeral"
import { PaymentItem } from "@/graphql/gql/graphql"
import { TableCSS } from "@/components/common/custom/styles"

interface ModalProps {
  id?: string
  paymentType: PaymentType
  hide: (params: PaymentItem[]) => void
}

interface RowObj {
  [key: string]: PaymentItem
}

export default function TerminalWindowPaymentItemsDialog(props: ModalProps) {
  const [selectedRow, setSelectedRow] = useState<RowObj | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element

  const { data, loading, refetch } = useSearchPaymentItems({
    variables: {
      page: 0,
      size: 500,
      paymentType: props.paymentType,
      id: props?.id,
    },
  })

  const onSearch = (params: { filter: string }) => {
    refetch({
      variables: {
        filter: params.filter,
        page: 0,
        size: 500,
        paymentType: props.paymentType,
      },
    })
  }

  const onSelect = (record?: PaymentItem | null) => {
    const currentSel = [...selectedRowKeys, record?.id]
    const existing = { ...selectedRow }
    if (record) {
      existing[record?.id as string] = record
      setSelectedRow(existing)
    }
    setSelectedRowKeys(currentSel)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect,
  }

  useEffect(() => {
    // Focus on the input field when the modal is opened
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const columns: ColumnProps<PaymentItem>[] = [
    {
      title: "Name",
      dataIndex: "itemName",
      width: 250,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      align: "right",
    },
    {
      title: "Price",
      dataIndex: "price",
      align: "right",
      render: (text) => numeral(text).format("0,0.00"),
    },
  ]

  const onSubmit = () => {
    const selectedItems: PaymentItem[] = []
    selectedRowKeys.map((key) => {
      if (selectedRow) {
        const record = selectedRow[key as string]
        selectedItems.push({ qty: 0, amount: 0, price: 0, ...record })
      }
    })

    props.hide(selectedItems)
  }
  return (
    <Modal
      title="Items/Services"
      open
      onCancel={() => props.hide([])}
      onOk={() => onSubmit()}
      width="60%"
      okText="Select"
      okButtonProps={{ size: "large" }}
      cancelButtonProps={{ size: "large" }}
    >
      <Form autoComplete="" onFinish={onSearch}>
        <FormInput
          name="filter"
          propsinput={{
            suffix: <SearchOutlined />,
            autoComplete: "off",
            placeholder: "Search misc items here ...",
            autoFocus: true,
          }}
          ref={inputRef}
        />
      </Form>
      <TableCSS>
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data ?? []}
          scroll={{ y: 400 }}
          pagination={false}
          rowSelection={rowSelection}
          onRow={(record: any, rowIndex) => {
            return {
              onClick: (event) => {
                onSelect(record)
              }, // click row
            }
          }}
        />
      </TableCSS>
    </Modal>
  )
}
