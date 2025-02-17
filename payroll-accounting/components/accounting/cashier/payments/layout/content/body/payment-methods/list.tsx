import { bankersRounding } from "@/utility/bank-utils"
import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Row, Typography } from "antd"
import numeral from "numeral"
import React from "react"
import styled from "styled-components"
import {
  PaymentMethod,
  TerminalWindowsPaymentMethod,
} from "../../../../data-types/interfaces"

const PaymentMethodTableRow = (
  props: { onClick: (id: string) => void } & PaymentMethod
) => {
  return (
    <tr>
      <td>{props.tenderedType}</td>
      <td style={{ textAlign: "right" }}>
        {numeral(bankersRounding(props?.amount)).format("0,0.00")}
      </td>
      <td style={{ textAlign: "center" }}>
        <Button
          icon={<MinusCircleOutlined />}
          type="text"
          size="small"
          style={{ color: "#9F9F9E" }}
          onClick={() => props.onClick(props.id)}
        />
      </td>
    </tr>
  )
}

const TerminalWindowsPaymentMethodList = React.memo(
  (props?: TerminalWindowsPaymentMethod) => {
    console.log("Payment method list....")
    const paymentMethods = props?.paymentMethods ?? []
    const hasValues = paymentMethods.length > 0

    const onDeletePaymentMethod = (id: string) => {
      const payload = [...paymentMethods]
      const index = payload.findIndex((p) => p.id == id)
      payload.splice(index, 1)
      props?.dispatch({ type: "set-payment-methods", payload })
    }

    return (
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Divider dashed />
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <td style={{ width: "50%" }}>
                    <Typography.Text strong style={{ color: "#399b53" }}>
                      Type
                    </Typography.Text>
                  </td>
                  <td style={{ textAlign: "right", width: "40%" }}>
                    <Typography.Text strong style={{ color: "#399b53" }}>
                      Tendered
                    </Typography.Text>
                  </td>
                  <td style={{ width: "5%", textAlign: "center" }} />
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((pm) => (
                  <PaymentMethodTableRow
                    key={pm.id}
                    {...pm}
                    onClick={onDeletePaymentMethod}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <Typography.Text strong style={{ color: "#399b53" }}>
                      Total Amount Tendered
                    </Typography.Text>
                  </td>
                  <td style={{ textAlign: "right", width: "40%" }}>
                    <Typography.Text strong>
                      {numeral(
                        bankersRounding(props?.totalAmountTendered ?? 0)
                      ).format("0,0.00")}
                    </Typography.Text>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </TableContainer>
        </Col>
      </Row>
    )
  }
)

const TableContainer = styled.div`
  max-height: 290px; /* Adjust the max height as needed */
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    color: #399b53;
  }

  th {
    position: sticky;
    top: 0;
    background-color: white; /* Set the background color as needed */
    z-index: 2;
  }

  thead th {
    background-color: #f4f4f4; /* Header background color */
  }

  th,
  td {
    border-bottom: 1px solid #dddddd;
    text-align: left;
    padding: 4px;
  }

  td {
    background-color: #fafafa;
  }
`

TerminalWindowsPaymentMethodList.displayName =
  "TerminalWindowsPaymentMethodList"

export default TerminalWindowsPaymentMethodList
