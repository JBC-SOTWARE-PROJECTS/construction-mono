import { Affix, Col, Divider, Row, Typography } from "antd"
import dayjs from "dayjs"
import { FinReportGenContextProps } from "."
import styled from "styled-components"

export default function FinGenReportHeader(props: FinReportGenContextProps) {
  const { state } = props

  return (
    <Row
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ paddingTop: "24px" }}
    >
      <Col span={24}>
        <Typography.Title level={3}>
          {state?.reportLayout?.title}
        </Typography.Title>
        <Affix>
          <HeaderTable>
            <tbody>
              <tr>
                <td className="header-col"></td>
                <td
                  className="header-amount-col"
                  style={{ fontWeight: "bold" }}
                >
                  {state.dateType == "month"
                    ? `${dayjs(state.reportDate[0]).format("MMM YYYY")}`
                    : `${dayjs(state.reportDate[0]).format("YYYY")}`}
                </td>
              </tr>
            </tbody>
          </HeaderTable>
        </Affix>
      </Col>
    </Row>
  )
}

const HeaderTable = styled.table`
  td {
    background: #fff;
  }
`
