import styled from "styled-components"

export const TableNoBorderRadCSS = styled.div`
  .ant-table {
    margin-top: 10px;
  }

  .ant-table-header {
    border-radius: 0 !important;
  }

  :where(.css-dev-only-do-not-override-1rdr8rr).ant-table-wrapper
    .ant-table-container
    table
    > thead
    > tr:first-child
    > *:first-child {
    border-radius: 0 !important;
  }

  :where(.css-dev-only-do-not-override-1rdr8rr).ant-table-wrapper
    .ant-table-container
    table
    > thead
    > tr:first-child
    > *:last-child {
    border-radius: 0 !important;
  }
`
