import { FormInputNumber } from "@/components/common"
import TitleBox from "@/components/common/custom/title-box"
import {
  Button,
  Col,
  Form,
  FormInstance,
  InputNumber,
  Space,
  Tag,
  Typography,
} from "antd"
import styled from "styled-components"
import { AmountSummaryI } from "../../../../data-types/interfaces"
import numeral from "numeral"
import Decimal from "decimal.js"

type Props = {
  form: FormInstance<{ amountTendered: number }>
  amountSummary: AmountSummaryI
  totalAmountTendered: number
}

const TerminalWindowAmountTendered = (props: Props) => {
  function getAmountChange() {
    const amountDue = new Decimal(props.amountSummary?.AMOUNT_DUE)
    const paymentMethod = new Decimal(props.totalAmountTendered)
    const change = parseFloat(amountDue.minus(paymentMethod).toString())
    return change
  }

  function setTenderedAmount() {
    alert()
    const amountChange = getAmountChange()
    props.form.setFieldValue("amountTendered", amountChange)
  }

  const amountChange = getAmountChange()

  return (
    <Col span={24}>
      <TitleBox
        title={
          <Typography.Text strong style={{ marginLeft: "10px", color: "red" }}>
            {amountChange > 0 ? "Remaining Balance" : "Change"}
          </Typography.Text>
        }
        extra={
          <Typography.Text strong>Payment Amount Tendered</Typography.Text>
        }
      />
      <Form form={props.form}>
        <InputCSS>
          <FormInputNumber
            name="amountTendered"
            propsinputnumber={{
              prefix: (
                <Tag bordered={false} color="red">
                  {numeral(Math.abs(amountChange)).format("0,0.00")}
                </Tag>
              ),
              size: "large",
              style: { width: "100%" },
              formatter: (value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              // parser: (value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number,
            }}
          />
        </InputCSS>
      </Form>
    </Col>
  )
}

export default TerminalWindowAmountTendered

const InputCSS = styled.div`
  input {
    text-align: right !important;
    padding-right: 30px !important;
  }
`
