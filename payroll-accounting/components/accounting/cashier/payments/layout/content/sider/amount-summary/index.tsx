import { bankersRounding } from "@/utility/bank-utils"
import { UpCircleOutlined } from "@ant-design/icons"
import { Button, Col, Row, Space } from "antd"
import numeral from "numeral"
import React, { ReactNode, useState } from "react"
import styled, { CSSProp } from "styled-components"
import { AmountSummaryI } from "../../../../data-types/interfaces"

type Props = {
  amountSummary: AmountSummaryI
}

const TableTR = (props: {
  label: string | ReactNode
  value: number
  amountDue?: boolean
  summary?: boolean
  italic?: boolean
  color?: string
  onShow?: any
}) => {
  const fontStyle: CSSProp = {
    fontStyle: props?.italic ? "italic" : "normal",
    fontSize: "12px",
  }
  const color = { color: props?.color ?? "black" }
  const style = { ...{ ...fontStyle, ...color } }

  return props.summary ? (
    <tr>
      <SummaryTableTotalTD
        style={{ ...style, fontSize: "20px", color: "#399b53" }}
      >
        {props.label}
      </SummaryTableTotalTD>
      <SummaryTableTotalTD
        align="right"
        style={{ ...style, fontSize: "20px", color: "#399b53" }}
      >
        <Space size="small" align="center">
          <p>{numeral(bankersRounding(props?.value ?? 0)).format("0,0.00")}</p>
          {props?.amountDue && (
            <Button
              size="large"
              icon={<UpCircleOutlined />}
              type="link"
              onClick={props.onShow}
            />
          )}
        </Space>
      </SummaryTableTotalTD>
    </tr>
  ) : (
    <tr>
      <td style={style}>{props.label}</td>
      <td align="right" style={style}>
        {numeral(bankersRounding(props?.value ?? 0)).format("0,0.00")}
      </td>
    </tr>
  )
}

const Details = ({ amountSummary }: Props) => {
  // Placeholder content for details
  return (
    <div style={{ padding: "5px" }}>
      <Row justify="end" gutter={[8, 8]}>
        <Col span={12}>
          <SummaryTable>
            <tbody>
              <TableTR
                label="Vatable Sales"
                value={amountSummary.TOTAL_SALES}
              />
              <TableTR label="VAT-Exempt Sales" value={0} />
              <TableTR label="VAT-Zero Rated Sales" value={0} />
              <TableTR label="VAT Amount" value={0} />
              <TableTR
                label="Total Sales"
                value={amountSummary.TOTAL_SALES}
                summary
              />
            </tbody>
          </SummaryTable>
        </Col>
        <Col span={12}>
          <SummaryTable>
            <tbody>
              <TableTR label="Total Sales" value={amountSummary.TOTAL_SALES} />
              <TableTR
                label="Less: VAT"
                value={amountSummary.LESS_VAT}
                italic
                color="#ff4d4f"
              />
              <TableTR
                label="Amount Net of VAT"
                value={amountSummary.AMOUNT_NET_VAT}
              />
              <TableTR
                label="Less: Disc"
                value={amountSummary.LESS_DISC}
                italic
                color="#ff4d4f"
              />
              <TableTR
                label="Less: Withholding Tax"
                value={amountSummary.LESS_WITHOLDING_TAX}
                italic
                color="#ff4d4f"
              />
              <TableTR
                label="Amount Due"
                value={amountSummary.TOTAL_SALES}
                summary
              />
            </tbody>
          </SummaryTable>
        </Col>
      </Row>
    </div>
  )
}

const TerminalAmountSummary = React.memo((props: Props) => {
  const { amountSummary } = props
  const [showDetails, setShowDetails] = useState(false)

  const onShow = () => {
    setShowDetails(!showDetails)
  }

  return (
    <SummaryDiv>
      {/* {showDetails && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            backgroundColor: "white",
            padding: "10px",
            width: "100%",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Details {...props} />
        </div>
      )} */}
      <div
        style={{
          // position: "absolute",
          // bottom: 60,
          left: 0,
          backgroundColor: "white",
          padding: 0,
          width: "100%",
          // borderTop: "1px solid #e5e7eb",
        }}
      >
        <Details {...props} />
      </div>
      {/* <Row justify="end" gutter={[8, 8]}> */}
      {/* <Col flex="auto" />
        <Col flex="400px">
          <SummaryTable>
            <TableTR
              label="Amount Due"
              value={amountSummary.AMOUNT_DUE}
              summary
              amountDue={true}
              onShow={onShow}
            />
          </SummaryTable>
        </Col> */}
      {/* </Row> */}
    </SummaryDiv>
  )
})

TerminalAmountSummary.displayName = "TerminalAmountSummary"

export default TerminalAmountSummary

const SummaryDiv = styled.div`
  border-top: 1px solid #e5e7eb;
  position: fixed;
  bottom: 0;
  width: 45%;
  height: 185px;
  z-index: 1;
  padding: 10px;
  background: white;
  margin-bottom: 28px;
`

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    border-bottom: none !important;
  }
`

const SummaryTableTotalTD = styled.td`
  font-weight: bold;
  border-bottom: none !important;
`
