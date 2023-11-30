import styled from 'styled-components'
import { Reducer, StateI } from './types'

export const ReceivePayReducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'set-customerId':
      return {
        ...state,
        customerId: action.payload,
      }
    case 'set-amountToApply':
      return {
        ...state,
        amountToApply: action.payload,
      }
    case 'set-invoiceType':
      return {
        ...state,
        invoiceType: action.payload,
      }
    case 'set-paymentMethod':
      return {
        ...state,
        paymentMethod: action.payload,
      }
    case 'set-transactions':
      return {
        ...state,
        transactions: action.payload,
      }
    case 'set-selectedRowKeys':
      return {
        ...state,
        selectedRowKeys: action.payload,
      }
    default:
      return state
  }
}

export const paymentMethodTypeOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'CHECK', label: 'Check' },
  { value: 'BANKDEPOSIT', label: 'Bank Deposit' },
  { value: 'EWALLET', label: 'E-Wallet' },
]

export const EditableTableCSS = styled.div`
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 0px;
    min-height: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  th.ant-table-cell {
    border-radius: 0px !important;
    background: #fff !important;
    color: #000a1ebf !important;
    font-weight: bolder !important;
  }

  .ant-table-thead tr td.ant-table-row-expand-icon-cell {
    border-radius: 0px !important;
    background-color: #fff !important;
    color: #000a1ebf !important;
    font-weight: bolder !important;
  }
`
