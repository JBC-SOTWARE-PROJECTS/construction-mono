import styled from 'styled-components'

export const CommonTableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`

export const TableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: teal !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }
`

export const ModalStyles = {
  style: {
    top: 20,
    border: 'none',
    boxShadow: 'none',
    marginBottom: 100,
  },
  maskStyle: { mask: { background: '#f2f3f4' } },
}

export const CNFormCommonStyles = {
  fontWeight: 'bold',
}

export const ModalStyle = styled.div`
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #333;
    text-align: right;
    padding: 10px;
    z-index: 99;
    padding-left: 14px;
    padding-right: 18px;
    transition: all 0.3s ease !important;
  }
`
