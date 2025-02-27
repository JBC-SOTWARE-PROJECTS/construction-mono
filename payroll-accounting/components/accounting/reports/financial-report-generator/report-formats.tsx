import { ReportType, ReportsLayout } from "@/graphql/gql/graphql"
import {
  useMutationGenerateStandardLayout,
  useMutationReportsLayoutToggleDefaultFormat,
  useQueryFindAllCustomReportsLayoutByType,
  useQueryFindOneStandardReportsLayoutByType,
} from "@/hooks/useReportsLayout"
import {
  CheckCircleTwoTone,
  SelectOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import {
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  FloatButton,
  List,
  Space,
  Typography,
} from "antd"
import { FinReportGenContextProps } from "."

const gridStyle: React.CSSProperties = {
  width: "100%",
  cursor: "pointer",
  padding: 5,
}

interface LayoutListProps {
  source: ReportsLayout[]
  onSwitch: (params: boolean, id: string) => void
  loading: boolean
  reportType: ReportType
}

const LayoutList = (props: LayoutListProps) => {
  const [onGenerateStandardLayout, { loading: onLoadingStandardLayout }] =
    useMutationGenerateStandardLayout()

  const onReGenerateStandardLayout = () => {
    onGenerateStandardLayout({
      variables: {
        reportType: props.reportType,
      },
    })
  }

  return (
    <Card
      bordered={false}
      style={{ boxShadow: "none" }}
      bodyStyle={{ padding: 0 }}
    >
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={props.source}
        loading={props.loading}
        renderItem={(item, index) => (
          <Card.Grid key={item.id} style={gridStyle}>
            <List.Item
              actions={[
                <Space key={`${item.id}-space`}>
                  {item.isStandard && (
                    <Button
                      type="text"
                      icon={<SyncOutlined spin={onLoadingStandardLayout} />}
                      onClick={onReGenerateStandardLayout}
                      disabled={onLoadingStandardLayout}
                      style={{ color: "#eab308" }}
                    >
                      Sync
                    </Button>
                  )}
                  {!!item?.isActive ? (
                    <Space>
                      <Typography.Text type="success">Active</Typography.Text>
                      <Badge status="processing" />
                    </Space>
                  ) : (
                    <Button
                      type="text"
                      icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                      onClick={() => props.onSwitch(true, item.id)}
                      disabled={onLoadingStandardLayout}
                      style={{ background: "#d6d3d1" }}
                    >
                      Set as Default
                    </Button>
                  )}
                  {/* <Tooltip
                    title={
                      !!item?.isActive
                        ? "Can't toggle active layout"
                        : "Toggle to set as active"
                    }
                  >
                    <Switch
                      checkedChildren={<CheckCircleOutlined />}
                      checked={!!item?.isActive}
                      disabled={!!item?.isActive}
                      onChange={(checked: boolean) =>
                        props.onSwitch(checked, item.id)
                      }
                    />
                  </Tooltip> */}
                </Space>,
              ]}
            >
              {item.layoutName}
            </List.Item>
          </Card.Grid>
        )}
      />
    </Card>
  )
}

export default function FinGenReportFormats(props: FinReportGenContextProps) {
  const { dispatch, state } = props

  const { data: layouts, refetch: refetchLayout } =
    useQueryFindAllCustomReportsLayoutByType(state.reportType, !state.open)

  const { data: standard, refetch: refetchStandard } =
    useQueryFindOneStandardReportsLayoutByType(state.reportType, !state.open)

  const [onToggleDefaultFormat, { loading: onLoadingToggle }] =
    useMutationReportsLayoutToggleDefaultFormat()

  const profitLoss = (layouts?.reportsLayout ?? []) as ReportsLayout[]
  const standardProfitLoss = (standard?.reportsLayout ?? {}) as ReportsLayout

  const showDrawer = () => {
    dispatch({ type: "set-open", payload: true })
  }

  const onClose = () => {
    dispatch({ type: "set-open", payload: false })
  }

  const onUpdateDefaultLayout = (checked: boolean, id: string) => {
    if (checked)
      onToggleDefaultFormat({
        variables: {
          id,
          reportType: state?.reportType,
        },
        onCompleted: () => {
          refetchLayout()
          refetchStandard()
          props.functions.onUpdate()
        },
      })
  }

  return (
    <>
      <FloatButton
        type="primary"
        icon={<SelectOutlined />}
        tooltip={<div>Change Format</div>}
        onClick={showDrawer}
      />
      <Drawer
        closable={false}
        title={state.reportLayout?.reportLayoutLabel}
        placement="right"
        width={500}
        onClose={onClose}
        open={state.open}
        extra={
          <Space>
            <Button type="primary" danger onClick={onClose}>
              Close
            </Button>
          </Space>
        }
      >
        <Divider orientation="left" plain>
          Standard System Report
        </Divider>
        <LayoutList
          source={[{ ...standardProfitLoss }]}
          onSwitch={onUpdateDefaultLayout}
          loading={onLoadingToggle}
          reportType={state.reportType}
        />

        <Divider orientation="left" plain>
          Revised personalized reports
        </Divider>
        <LayoutList
          source={profitLoss}
          onSwitch={onUpdateDefaultLayout}
          loading={onLoadingToggle}
          reportType={state.reportType}
        />
      </Drawer>
    </>
  )
}
