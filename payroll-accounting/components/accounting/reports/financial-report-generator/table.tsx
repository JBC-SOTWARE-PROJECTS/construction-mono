import { Col, Row } from "antd"
import numeral from "numeral"
import { FinReportGenContextProps } from "."

const mapAmount = (amount: number) => {
  if (amount < 0) return `(${numeral(Math.abs(amount)).format("0,0.00")})`
  return numeral(amount).format("0,0.00")
}

function remapTable(rows: [any], indent: number): any {
  return rows.map((pl: any, index: number) => {
    if (pl.isGroup) {
      const childRow = JSON.parse(pl.rows)
      const indention = 5 + indent

      if (pl?.isHide) {
        return (
          <tr key={pl.id}>
            <td className="child-col" style={{ textIndent: indention }}>
              {pl.title}
            </td>
            <td className="amount-col">{mapAmount(pl.amount)}</td>
          </tr>
        )
      }

      return (
        <tr key={pl.id}>
          <td colSpan={2} style={{ paddingLeft: indention }}>
            <table style={{ width: "100%" }}>
              <tr>
                <td className="group-col">{pl.title}</td>
                <td className="group-amount-col"></td>
              </tr>
              {childRow.length > 0 ? remapTable(childRow, indention + 5) : null}
            </table>
          </td>
        </tr>
      )
    }

    if (pl.isChild) {
      return (
        <tr key={pl.id}>
          <td className="child-col" style={{ paddingLeft: indent + 5 }}>
            {pl.title}
          </td>
          <td className="amount-col">{mapAmount(pl.amount)}</td>
        </tr>
      )
    }

    if (pl.isTotal) {
      return (
        <tr key={`total-${pl.id}`}>
          <td className="total-col">{pl.title}</td>
          <td className="total-amount-col">{mapAmount(pl.amount)}</td>
        </tr>
      )
    }
  })
}

export default function FinGenReportTable(props: FinReportGenContextProps) {
  const { state } = props

  return (
    <Row>
      <Col span={24}>
        <table>
          <tbody>
            {(state?.reportData ?? []).map((pl: any) => {
              const rows = JSON.parse(pl.rows)

              if (pl.isGroup) {
                return (
                  <>
                    <tr key={pl.id}>
                      <td className="group-col">{pl.title}</td>
                      <td className="group-amount-col"></td>
                    </tr>
                    {remapTable(rows, 10)}
                    <tr>
                      <td className=""></td>
                      <td className=""></td>
                    </tr>
                  </>
                )
              }

              if (pl.isFormula) {
                return (
                  <>
                    <tr>
                      <td className=""></td>
                      <td className=""></td>
                    </tr>
                    <tr key={pl.id}>
                      <td className="formula-col">{pl.title}</td>
                      <td className="formula-amount-col">
                        {mapAmount(pl.amount)}
                      </td>
                    </tr>
                    <tr>
                      <td className=""></td>
                      <td className=""></td>
                    </tr>
                  </>
                )
              }
            })}
          </tbody>
        </table>
      </Col>
    </Row>
  )
}
