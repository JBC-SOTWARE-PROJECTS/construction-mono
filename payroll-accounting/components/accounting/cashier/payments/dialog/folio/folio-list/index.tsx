import { TableCSS } from "@/components/accountReceivables/common/style"
import { FormInput } from "@/components/common"
import { PaymentBillingFolioDto } from "@/graphql/gql/graphql"
import { SearchOutlined, SelectOutlined } from "@ant-design/icons"
import { gql, useQuery } from "@apollo/client"
import { Button, Form, Modal, Table } from "antd"
import { ColumnProps } from "antd/es/table"
import { useEffect, useRef } from "react"

const FOLIO_LIST = gql`
  query (
    $filter: String
    $registryType: String
    $page: Int
    $pageSize: Int
    $active: Boolean
  ) {
    folios: paymentFolioList(
      filter: $filter
      registryType: $registryType
      page: $page
      pageSize: $pageSize
      active: $active
    ) {
      content {
        id
        billingNo
        patientName
        caseNo
        registryType
        status
      }
    }
  }
`

interface ModalProps {
  hide: (id?: string) => void
}
export default function TerminalWindowFolioListDialog(props: ModalProps) {
  const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element

  const { data, loading, refetch } = useQuery(FOLIO_LIST, {
    variables: {
      filter: "",
      page: 0,
      pageSize: 5,
      registryType: "ALL",
      active: true,
    },
  })

  const onSearch = (props: { filter: string }) => {
    refetch({ filter: props?.filter ?? "" })
  }

  const onSelect = (id: string) => {
    props.hide(id)
  }

  const columns: ColumnProps<PaymentBillingFolioDto>[] = [
    {
      title: "Folio No",
      dataIndex: "billingNo",
      width: 100,
    },
    {
      title: "Patient",
      dataIndex: "patientName",
    },
    {
      title: "Case No",
      dataIndex: "caseNo",
      width: 80,
    },
    {
      title: "Registry Type",
      dataIndex: "registryType",
      width: 120,
    },
    {
      dataIndex: "id",
      align: "center",
      width: 50,
      render: (id: string) => (
        <Button
          icon={<SelectOutlined />}
          size="small"
          type="text"
          onClick={() => onSelect(id)}
        />
      ),
    },
  ]

  useEffect(() => {
    // Focus on the input field when the modal is opened
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <Modal
      title="Billing Folios"
      open
      onCancel={() => props.hide()}
      width="60%"
      footer={null}
    >
      <Form autoComplete="" onFinish={onSearch}>
        <FormInput
          name="filter"
          propsinput={{
            suffix: <SearchOutlined />,
            autoComplete: "off",
            placeholder: "Search folio no or patient here ...",
            autoFocus: true,
          }}
          ref={inputRef}
        />
      </Form>
      <TableCSS>
        <Table
          rowKey="id"
          loading={loading}
          size="small"
          columns={columns}
          dataSource={data?.folios?.content ?? []}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                onSelect(record.id)
              }, // click row
            }
          }}
        />
      </TableCSS>
    </Modal>
  )
}
