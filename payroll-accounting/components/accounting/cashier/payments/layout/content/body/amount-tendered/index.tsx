import { FormInputNumber } from "@/components/common"
import TitleBox from "@/components/common/custom/title-box"
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Tag,
  Typography,
} from "antd"
import styled from "styled-components"
import { AmountSummaryI } from "../../../../data-types/interfaces"
import numeral from "numeral"
import Decimal from "decimal.js"
import { bankersRounding } from "@/utility/bank-utils"

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
    const amountChange = getAmountChange()
    props.form.setFieldValue("amountTendered", bankersRounding(amountChange))
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
          <Space.Compact style={{ width: "100%" }}>
            <Button
              size="large"
              style={{ fontSize: "20px!important" }}
              onClick={setTenderedAmount}
            >
              {numeral(Math.abs(amountChange)).format("0,0.00")}
            </Button>
            <FormInputNumber
              name="amountTendered"
              style={{ width: "100%" }}
              propsinputnumber={{
                size: "large",
                style: { width: "100%", fontSize: "20px" },
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number,
              }}
            />
          </Space.Compact>
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
