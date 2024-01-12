import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Card, Col, Divider, List, Row, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import ReportItem from './reportItem'
import { useRouter } from 'next/router'
import { useDialog } from '@/hooks'
import FormulaItem from './formulaItem'
import CreateReportGroup from '../dialogs/createReportGroup'
import CreateReportFormula from '../dialogs/createReportFormula'

const GQL_QUERY = gql`
  query ($id: UUID) {
    groups: getReportItemsByReportId(id: $id) {
      id
      title
      itemType
      normalSide
      isGroup
      isFormula
      formulaGroups
      config {
        hideGroupAccounts
        isCurrentYearEarningsFormula
        totalLabel
      }
    }
  }
`

const FIND_ONE_QUERY = gql`
  query ($id: UUID) {
    reportLayout: findOneReportLayoutById(id: $id) {
      id
      layoutName
      title
      reportType
    }
  }
`

const AccountList = () => {
  const router = useRouter()

  const createGroupDialog = useDialog(CreateReportGroup)
  const createFormulaDialog = useDialog(CreateReportFormula)

  const { data: reportLayoutData, loading: reportLayoutLoading } = useQuery(
    FIND_ONE_QUERY,
    {
      variables: {
        id: router?.query?.id,
      },
    }
  )
  const { title, layoutName, reportType } = reportLayoutData?.reportLayout ?? {
    title: '',
    layoutName: '',
    reportType: '',
  }

  const {
    data: reportData,
    loading: reportLoading,
    refetch,
  } = useQuery(GQL_QUERY, {
    variables: {
      id: router?.query?.id,
    },
  })

  const onAddGroup = (parentId?: string) => {
    createGroupDialog(
      { reportType, reportsLayoutId: router?.query?.id },
      () => {
        refetch()
      }
    )
  }

  const onAddFormula = (parentId?: string) => {
    createFormulaDialog(
      { reportType, reportsLayoutId: router?.query?.id },
      () => {
        refetch()
      }
    )
  }

  return (
    <>
      <Card size='small' style={{ marginBottom: 10 }}>
        <Space>
          <Button icon={<PlusCircleOutlined />} onClick={() => onAddGroup()}>
            Add Group
          </Button>
          <Button icon={<PlusCircleOutlined />} onClick={() => onAddFormula()}>
            Add Formula
          </Button>
        </Space>
      </Card>
      <Card bordered style={{ minHeight: 800 }}>
        <Row>
          <Col span={24}>
            <Typography.Title level={3}>{title}</Typography.Title>
          </Col>
        </Row>
        <Row>
          <Col span={20} />
          <Col span={4} style={{ textAlign: 'right' }}>
            <b>September 2023</b>
          </Col>
        </Row>
        <Divider />
        <Space direction='vertical' style={{ width: '100%' }}>
          {(reportData?.groups ?? []).map((groupItems: any) => {
            return groupItems?.isFormula ? (
              <FormulaItem
                key={groupItems.id}
                reportType={reportType}
                record={groupItems}
                reportId={router?.query?.id as string}
                refetchParent={refetch}
              />
            ) : (
              <ReportItem
                key={groupItems.id}
                {...{
                  id: groupItems.id as string,
                  title: groupItems?.title ?? '',
                  isGroup: groupItems.isGroup,
                  itemType: groupItems.itemType,
                  normalSide: groupItems.normalSide,
                  config: groupItems.config,
                  reportType,
                  bordered: true,
                  refetchParent: refetch,
                }}
              />
            )
          })}
        </Space>
      </Card>
    </>
  )
}

export default AccountList
