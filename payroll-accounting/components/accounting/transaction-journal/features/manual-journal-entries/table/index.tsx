import ChartOfAccountsComponentSelector from "@/components/chartOfAccounts/chartOfAccountsSelector"
import { ChartOfAccountGenerate, Ledger } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import {
  DeleteOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons"
import { Button, Popconfirm, Table, Typography } from "antd"
import Decimal from "decimal.js"
import numeral from "numeral"
import { useMemo } from "react"
import styled from "styled-components"
import { MJEntriesI, ManualJournalEntriesContextProps } from ".."
import { MJEditableCell, MJEditableRow } from "./components"
import { TableCSS } from "@/components/common/custom/styles"

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>

const MJETable = (props: ManualJournalEntriesContextProps) => {
  const { state, dispatch } = props
  const { dataSource, header } = state

  const posted = !!header?.approvedBy

  const showSelectCoa = useDialog(ChartOfAccountsComponentSelector)

  const handleDelete = (key: string) => {
    const newData = dataSource.filter(
      (item) => item?.journalAccount?.code !== key
    )
    dispatch({ type: "set-data-source", payload: newData })
  }

  const defaultColumns: (any & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: "Code",
      dataIndex: ["journalAccount", "code"],
      width: "130px",
    },
    {
      title: "Description",
      dataIndex: ["journalAccount", "accountName"],
    },
    {
      title: <div style={{ paddingRight: "12px" }}>Debit</div>,
      dataIndex: "debit",
      editable: !posted,
      align: "right",
      width: "135px",
      render: (text: number) => (text == 0 ? "-" : text),
    },
    {
      title: <div style={{ paddingRight: "12px" }}>Credit</div>,
      dataIndex: "credit",
      editable: !posted,
      align: "right",
      width: "135px",
      render: (text: number) => (text == 0 ? "-" : text),
    },
    {
      title: <MoreOutlined />,
      dataIndex: "operation",
      fixed: "right",
      width: 40,
      render: (_: any, record: Ledger) =>
        dataSource.length >= 1 && !posted ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record?.journalAccount?.code ?? "")}
          >
            <Button icon={<DeleteOutlined />} size="small" type="text" />
          </Popconfirm>
        ) : (
          <></>
        ),
    },
  ]

  const handleAdd = () => {
    const existing: any = {}
    const defaultSelected = dataSource.map((data) => {
      if (data?.journalAccount?.code)
        existing[data?.journalAccount?.code] = data

      return { ...(data?.journalAccount ?? {}) }
    })

    showSelectCoa(
      { defaultSelected, includeMother: false },
      (returned: any[]) => {
        if (returned) {
          const payload: Ledger[] = returned.map(({ code, accountName }) => ({
            ...(existing[code] ?? {}),
            journalAccount: {
              code: code,
              accountName: accountName,
            },
          }))
          dispatch({ type: "set-data-source", payload })
        }
      }
    )
  }

  const handleSave = (row: Ledger) => {
    const newData = [...dataSource]
    const index = newData.findIndex(
      (item) => item.journalAccount?.code === row.journalAccount?.code
    )
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    dispatch({ type: "set-data-source", payload: newData })
  }

  const components = {
    body: {
      row: MJEditableRow,
      cell: MJEditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: MJEntriesI) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  const totals = useMemo(() => {
    return state.dataSource.reduce(
      (summary, data) => {
        const debit = new Decimal(data?.debit ?? 0)
        const totalDebit = new Decimal(summary.totalDebit)
        const credit = new Decimal(data?.credit ?? 0)
        const totalCredit = new Decimal(summary.totalCredit)
        const totalAmountDebit = new Decimal(state.totalAmount.debit)
        const totalAmountCredit = new Decimal(state.totalAmount.credit)

        const preTotalDebit = debit.plus(totalDebit)
        const preTotalCredit = credit.plus(totalCredit)

        if (!state.header?.custom) {
          const dDiff = totalAmountDebit.minus(preTotalDebit)
          const cDiff = totalAmountCredit.minus(preTotalCredit)
          summary.debitDiff = parseFloat(dDiff.toString())
          summary.creditDiff = parseFloat(cDiff.toString())
        }

        summary.isEqual = preTotalDebit.equals(preTotalCredit)
        summary.totalDebit = parseFloat(preTotalDebit.toString())
        summary.totalCredit = parseFloat(preTotalCredit.toString())

        return summary
      },
      {
        totalDebit: 0,
        totalCredit: 0,
        debitDiff: 0,
        creditDiff: 0,
        isEqual: false,
      }
    )
  }, [state.dataSource, state.header?.custom, state.totalAmount])

  return (
    <MJETableCSS>
      {!state?.header?.approvedBy && (
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
          icon={<PlusCircleOutlined />}
        >
          Add a new account
        </Button>
      )}
      <TableCSS>
        <Table
          size="small"
          components={components}
          rowClassName={() => "editable-row"}
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          scroll={{ x: 900 }}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Typography.Text strong>Total</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Typography.Text
                    strong
                    type={totals.isEqual ? "success" : "danger"}
                    style={{ paddingRight: "12px" }}
                  >
                    {totals?.debitDiff != 0
                      ? `(${numeral(totals.debitDiff).format("0,0.00")})`
                      : ""}{" "}
                    {numeral(totals.totalDebit).format("0,0.00")}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Typography.Text
                    strong
                    type={totals.isEqual ? "success" : "danger"}
                    style={{ paddingRight: "12px" }}
                  >
                    {totals?.creditDiff != 0
                      ? `(${numeral(totals.creditDiff).format("0,0.00")})`
                      : ""}{" "}
                    {numeral(totals.totalCredit).format("0,0.00")}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
              </Table.Summary.Row>
            )
          }}
        />
      </TableCSS>
    </MJETableCSS>
  )
}

export default MJETable

const MJETableCSS = styled.div`
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    min-height: 35px;
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  input {
    text-align: right !important;
    padding-right: 30px !important;
  }
`
