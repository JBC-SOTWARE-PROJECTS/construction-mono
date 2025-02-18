import { FormDatePicker, FormSelect } from "@/components/common"
import { Button, Col, Form, Row, Space } from "antd"
import dayjs from "dayjs"
import { FinReportGenContextProps } from "."
import { DownloadOutlined } from "@ant-design/icons"
import { FinReportGenDateDataType } from "@/routes/accounting/reports/financial-reports/report-generator"
import { StatusButton } from "../../commons/custom-antd"

export default function FinReportGeneratorFilter(
  props: FinReportGenContextProps
) {
  const { form, dispatch, state, functions, loading } = props

  const iStandard = props.state?.reportLayout?.isStandard

  const onChangeDateType = (payload: FinReportGenDateDataType) => {
    const value = form.getFieldValue("reportDate")
    dispatch({ type: "set-date-type", payload })
    if (payload == "month") {
      dispatch({
        type: "set-report-date",
        payload: [dayjs(value).startOf("month"), dayjs(value).endOf("month")],
      })

      form.setFieldValue("reportDate", dayjs(value, "MMM YYYY"))
    } else {
      dispatch({
        type: "set-report-date",
        payload: [dayjs(value).startOf("year"), dayjs(value).endOf("year")],
      })
      form.setFieldValue("reportDate", dayjs(value, "YYYY"))
    }
  }

  const onSetDate = (value: any) => {
    dispatch({
      type: "set-report-date",
      payload: [dayjs(value).startOf("month"), dayjs(value).endOf("month")],
    })
  }

  return (
    <Form
      form={props.form}
      layout="vertical"
      initialValues={{
        dateType: "month",
        reportDate: dayjs(dayjs(), "MMM YYYY"),
      }}
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Space>
            <FormSelect
              name="dateType"
              label="Date Type"
              propsselect={{
                options: [
                  { label: "Monthly", value: "month" },
                  { label: "Yearly", value: "year" },
                ],
                onChange: (e) => onChangeDateType(e),
              }}
            />
            <FormDatePicker
              name="reportDate"
              label="Report Date"
              propsdatepicker={{
                onChange: (_, dateString: any) => onSetDate(_),
                picker: state.dateType as any,
                format: state.dateType == "month" ? "MMM YYYY" : "YYYY",
              }}
            />
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <Button onClick={() => functions.onUpdate()}>Update</Button>
            {!iStandard ? (
              <Button
                type="primary"
                onClick={functions.editLayout}
                loading={loading.check}
              >
                Edit Layout
              </Button>
            ) : (
              // <Button
              //   type="primary"
              //   onClick={functions.onHandleCreateCustomLayout}
              //   loading={loading.customLayout}
              // >
              //   Add Custom Layout
              // </Button>
              <></>
            )}
            <StatusButton
              type="primary"
              onClick={functions.downloadCSV}
              loading={loading.generate}
              status="CSV-DOWNLOAD"
              icon={<DownloadOutlined />}
            >
              Download CSV
            </StatusButton>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}
