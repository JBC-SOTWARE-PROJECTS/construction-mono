import { Button, Select, Space, Table } from 'antd'
import styled from 'styled-components'
import { CnTablePropsI } from '.'
import { InvoiceTypeT, StateI } from '..'
import {
  CnDispatch,
  CnLoadingI,
  CnMutation,
  CnRefetchI,
} from '../CreditNCreate'
import { PlusCircleOutlined } from '@ant-design/icons'
import { InvoiceTypeOption } from '@/constant/accountReceivables'
import { onHandleCnAddClaimsItems } from '../components'
import { onHandleCnAdd, onSelectInvoiceType } from '../functions'

type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface CnBodyTableI {
  tableProps: CnTablePropsI
  state: StateI
  loading?: CnLoadingI
  dispatch: CnDispatch
  claimsDialog: any
  mutation?: CnMutation
  refetch?: CnRefetchI
}

export default function CnBodyTable(props: CnBodyTableI) {
  const { tableProps, state, dispatch, claimsDialog, mutation, refetch } = props

  const onClickAddClaims = () => {
    onHandleCnAddClaimsItems({
      state,
      claimsDialog,
      refetch,
    })
  }

  const onClickAddRecord = () => {
    onHandleCnAdd({
      state,
      mutation,
      dispatch,
    })
  }

  const onHandleSelectInvoiceType = (invoiceType: InvoiceTypeT) => {
    onSelectInvoiceType({
      invoiceType,
      state,
      mutation,
      dispatch,
    })
  }

  return (
    <Space
      direction='vertical'
      style={{ width: '100%', marginTop: 35 }}
      size='middle'
    >
      <Space size='middle'>
        {state.invoiceType == 'REGULAR' && (
          <Button
            size='middle'
            icon={<PlusCircleOutlined />}
            onClick={onClickAddRecord}
            style={{ color: '#0078c8', fontWeight: 'bold' }}
          >
            Add Record
          </Button>
        )}

        {/* {state.creditNoteType == 'INVOICE' && (
          <Select
            options={InvoiceTypeOption}
            value={state.invoiceType}
            onChange={(e: InvoiceTypeT) => onHandleSelectInvoiceType(e)}
            disabled={state?.dataSource.length > 0}
          />
        )} */}
      </Space>
      <EditableTableCSS>
        <Table
          rowKey='id'
          components={tableProps.components}
          rowClassName={() => 'editable-row'}
          columns={tableProps.columns as ColumnTypes}
          size='middle'
          bordered
          dataSource={state.dataSource}
          pagination={false}
          scroll={{ x: 1200 }}
          loading={props?.loading?.creditNoteItem}
        />
      </EditableTableCSS>
    </Space>
  )
}

const EditableTableCSS = styled.div`
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 6px 0px;
    min-height: 35px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  th.ant-table-cell {
    border-radius: 0px !important;
    background: #fff !important;
    color: #000a1ebf !important;
    font-weight: bolder !important;
  }
`
