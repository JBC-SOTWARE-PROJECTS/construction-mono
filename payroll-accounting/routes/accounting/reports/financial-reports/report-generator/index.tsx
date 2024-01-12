import { FormDatePicker, FormDateRange, FormSelect } from '@/components/common'
import { getUrlPrefix } from '@/utility/graphql-client'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Segmented,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import { useState } from 'react'
import styled from 'styled-components'

const CHECK_REPORT_QUERY = gql`
  query ($reportType: ReportType) {
    reportLayout: checkExistingReportLayout(reportType: $reportType) {
      id
      title
    }
  }
`

const GENERATE_REPORT = gql`
  query ($reportLayoutId: UUID, $durationType: String, $end: String) {
    reportData: onGenerateSaveAccounts(
      reportLayoutId: $reportLayoutId
      durationType: $durationType
      end: $end
    ) {
      id
      title
      amount
      isGroup
      isChild
      isFormula
      isHide
      normalSide
      rows
    }
  }
`
const mapAmount = (amount: number) => {
  if (amount < 0) return `(${numeral(Math.abs(amount)).format('0,0.00')})`
  return numeral(amount).format('0,0.00')
}

function remapTable(rows: [any], indent: number): any {
  return rows.map((pl: any, index: number) => {
    console.log(pl, 'pl')
    if (pl.isGroup) {
      const childRow = JSON.parse(pl.rows)
      const indention = 10 + indent

      if (pl?.isHide) {
        return (
          <tr key={pl.id}>
            <td className='child-col' style={{ textIndent: indention }}>
              {pl.title}
            </td>
            <td className='amount-col'>{mapAmount(pl.amount)}</td>
          </tr>
        )
      }

      return (
        <>
          <tr key={pl.id}>
            <td className='group-col' style={{ textIndent: indention }}>
              {pl.title}
            </td>
            <td className=''></td>
          </tr>
          {childRow.length > 0 ? remapTable(childRow, indention + 10) : null}
        </>
      )
    }

    if (pl.isChild) {
      return (
        <tr key={pl.id}>
          <td className='child-col' style={{ textIndent: indent + 10 }}>
            {pl.title}
          </td>
          <td className='amount-col'>{mapAmount(pl.amount)}</td>
        </tr>
      )
    }

    if (pl.isTotal) {
      return (
        <tr key={`total-${pl.id}`} style={{ textIndent: indent - 10 }}>
          <td className='total-col'>{pl.title}</td>
          <td className='total-amount-col'>{mapAmount(pl.amount)}</td>
        </tr>
      )
    }
  })
}

interface ReportGeneratorI {
  reportType: string
}

export default function ReportGenerator(props: ReportGeneratorI) {
  const { reportType } = props
  const [form] = useForm()
  const { push } = useRouter()

  const [reportDate, setReportDate] = useState([dayjs(), dayjs()])
  const [dateType, setDateType] = useState('month')

  const [onGenerate, { data: generateData, loading: generateLoading }] =
    useLazyQuery(GENERATE_REPORT)

  const { data, loading: checkLoading } = useQuery(CHECK_REPORT_QUERY, {
    variables: {
      reportType,
    },
    onCompleted: ({ reportLayout }) => {
      onGenerate({
        variables: {
          reportLayoutId: reportLayout?.id,
          durationType: dateType,
          end:
            dateType == 'month'
              ? dayjs(reportDate[0]).startOf('M').format('YYYY-MM-DD')
              : dayjs(reportDate[1]).endOf('M').format('YYYY-MM-DD'),
        },
      })
    },
  })

  const { id, title } = data?.reportLayout ?? { id: null }

  const editLayout = () => {
    push(`/accounting/reports/financial-reports/report-generator/layout/${id}`)
  }

  const downloadCSV = () => {
    window.open(
      `${getUrlPrefix()}/accounting/reports/financial-report/reportExtract?reportLayoutId=${id}&durationType=${dateType}&end=${
        dateType == 'month'
          ? dayjs(reportDate[0]).startOf('M').format('YYYY-MM-DD')
          : dayjs(reportDate[1]).endOf('M').format('YYYY-MM-DD')
      }`
    )
  }

  const onUpdate = () => {
    onGenerate({
      variables: {
        reportLayoutId: id,
        durationType: dateType,
        end:
          dateType == 'month'
            ? dayjs(reportDate[0]).startOf('M').format('YYYY-MM-DD')
            : dayjs(reportDate[1]).endOf('M').format('YYYY-MM-DD'),
      },
    })
  }

  const onChangeDateType = (type: string) => {
    const value = form.getFieldValue('reportDate')
    setDateType(type)
    if (type == 'month') {
      setReportDate([
        dayjs(value).startOf('month'),
        dayjs(value).endOf('month'),
      ])
      form.setFieldValue('reportDate', dayjs(value, 'MMM YYYY'))
    } else {
      setReportDate([dayjs(value).startOf('year'), dayjs(value).endOf('year')])
      form.setFieldValue('reportDate', dayjs(value, 'YYYY'))
    }
  }

  const onSetDate = (value: any) => {
    setReportDate([dayjs(value).startOf('month'), dayjs(value).endOf('month')])
  }

  return (
    <PageContainer content='Balance Sheet'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          dateType: 'month',
          reportDate: dayjs(dayjs(), 'MMM YYYY'),
        }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className='gutter-row' span={3}>
            <FormSelect
              name='dateType'
              label='Date Type'
              propsselect={{
                options: [
                  { label: 'Monthly', value: 'month' },
                  { label: 'Yearly', value: 'year' },
                ],
                onChange: (e) => onChangeDateType(e),
              }}
            />
          </Col>
          <Col className='gutter-row' span={6}>
            <FormDatePicker
              name='reportDate'
              label='Report Date'
              // showpresstslist={true}
              propsdatepicker={{
                onChange: (_, dateString: any) => onSetDate(_),
                picker: dateType as any,
                format: dateType == 'month' ? 'MMM YYYY' : 'YYYY',
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <Space>
              <Button onClick={() => onUpdate()}>Update</Button>
              <Button
                type='dashed'
                danger
                onClick={editLayout}
                loading={checkLoading}
              >
                Edit Layout
              </Button>
              <Button
                type='dashed'
                onClick={downloadCSV}
                loading={checkLoading}
                style={{ color: 'teal' }}
              >
                Extract CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Spin tip='Loading...' spinning={generateLoading}>
        <ReportContainer>
          <Card>
            <Form form={form} name='form-data'>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                  <div style={{ background: 'teal' }}>
                    <Divider />
                    <Typography.Title
                      // editable
                      level={3}
                      style={{ marginLeft: 10, color: 'white' }}
                    >
                      {title}
                    </Typography.Title>
                    <table>
                      <tbody>
                        <tr>
                          <td className=''></td>
                          <td
                            className='header-amount-col'
                            style={{ color: 'white', fontWeight: 'bold' }}
                          >
                            {dateType == 'month'
                              ? `${dayjs(reportDate[0]).format('MMM YYYY')}`
                              : `${dayjs(reportDate[0]).format('YYYY')}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <table>
                    <tbody>
                      {(generateData?.reportData ?? []).map((pl: any) => {
                        const rows = JSON.parse(pl.rows)

                        if (pl.isGroup) {
                          return (
                            <>
                              <tr key={pl.id}>
                                <td className='group-col'>{pl.title}</td>
                                <td className=''></td>
                              </tr>
                              {remapTable(rows, 10)}
                              <tr>
                                <td className=''></td>
                                <td className=''></td>
                              </tr>
                            </>
                          )
                        }

                        if (pl.isFormula) {
                          return (
                            <>
                              <tr>
                                <td className=''></td>
                                <td className=''></td>
                              </tr>
                              <tr key={pl.id}>
                                <td className='formula-col'>{pl.title}</td>
                                <td className='formula-amount-col'>
                                  {mapAmount(pl.amount)}
                                </td>
                              </tr>
                              <tr>
                                <td className=''></td>
                                <td className=''></td>
                              </tr>
                            </>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Form>
          </Card>
        </ReportContainer>
      </Spin>
    </PageContainer>
  )
}

export const ReportContainer = styled.div`
  margin-top: 20px;

  table {
    width: 100%;
    color: teal;
  }

  td {
    padding: 4px;
    width: 80%;
    border-bottom: 1px solid #ffffff;
  }

  .child-col {
    width: 80%;
    background-color: #edfbfb;
  }

  .group-col {
    width: 80%;
    font-weight: bold;
  }

  .amount-col {
    text-align: right;
    background-color: #edfbfb;
  }

  .header-amount-col {
    text-align: right;
  }

  .total-col {
    font-weight: bold;
    border-top: 1px solid teal !important;
    border-bottom: 4px double teal;
  }

  .total-amount-col {
    font-weight: bold;
    text-align: right;
    border-top: 1px solid teal !important;
    border-bottom: 4px double teal;
  }

  .formula-col {
    font-weight: bold;
    border-top: 4px dashed teal !important;
    border-bottom: 4px dashed teal;
  }

  .formula-amount-col {
    font-weight: bold;
    text-align: right;
    border-top: 4px dashed teal !important;
    border-bottom: 4px dashed teal;
  }
`
