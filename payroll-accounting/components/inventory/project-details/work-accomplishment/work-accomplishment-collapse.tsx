import { Button, CollapseProps, Popconfirm, Space, message } from "antd"
import { Col, Collapse, Row, Typography } from "antd"
import WorkAccomplishmentsTable from "./work-accomplishment-table"
import { ProjectWorkAccomplish } from "@/graphql/gql/graphql"
import dayjs from "dayjs"
import {
  EditOutlined,
  ExportOutlined,
  LockOutlined,
  PrinterOutlined,
  SelectOutlined,
  UnlockOutlined,
} from "@ant-design/icons"
import { gql, useMutation } from "@apollo/client"
import { apiUrlPrefix } from "@/shared/settings"
import { useRouter } from "next/router"

const TOGGLE_LOCK = gql`
  mutation ($id: UUID) {
    toggle: projectWorkAccomplishToggleLock(id: $id) {
      id
    }
  }
`

const TOGGLE_POST_TO_BILLING = gql`
  mutation ($id: UUID) {
    posting: postSWAToBilling(id: $id) {
      response {
        id
      }
      message
      success
    }
  }
`
interface WorkAccomplishmentsCollapseI {
  data: { workAccomplish: ProjectWorkAccomplish[] }
  loading: boolean
  onHandleEdit: (id: string) => void
  refetch: any
}

export default function WorkAccomplishmentsCollapse(
  props: WorkAccomplishmentsCollapseI
) {
  const { data } = props
  const { push } = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [onToggleLock, { loading: toggleLockLoading }] =
    useMutation(TOGGLE_LOCK)

  const [onPostToBilling, { loading: onPostLoading }] = useMutation(
    TOGGLE_POST_TO_BILLING
  )

  const confirm = (id: string) => {
    onToggleLock({
      variables: {
        id,
      },
      onCompleted: () => props?.refetch(),
    })
  }

  const confirmPosting = (id: string) => {
    messageApi.open({
      key: "loading",
      type: "loading",
      content: "Loading...",
    })
    onPostToBilling({
      variables: {
        id,
      },
      onCompleted: (data) => {
        const posting = data?.posting
        messageApi.open({
          key: "success",
          type: "success",
          content: "Successfully posted to billing. Redirecting...",
          duration: 2,
        })
        push(`/accounting/billing/folio/${posting?.response?.id}`)
      },
    })
  }

  const printPDF = (id: string) => {
    window.open(
      apiUrlPrefix + "/statement-of-work-accomplished?id=" + id,
      "creditnote"
    )
  }

  const ButtonLock = ({ record }: { record: ProjectWorkAccomplish }) => {
    if (record.status == "OPEN") {
      return (
        <Popconfirm
          placement="topLeft"
          title="Toggle Lock"
          description="Proceed with toggling the lock?"
          onConfirm={() => confirm(record?.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            size="small"
            icon={<UnlockOutlined />}
            style={{
              background: "#4096ff",
            }}
          />
        </Popconfirm>
      )
    }

    return (
      <Button
        type="primary"
        size="small"
        icon={
          record?.status == "LOCKED" ? <LockOutlined /> : <UnlockOutlined />
        }
        style={{
          background: record?.status == "LOCKED" ? "red" : "#4096ff",
        }}
      />
    )
  }

  return (
    <Row>
      {contextHolder}
      <Col span={24}>
        <Collapse
          items={data?.workAccomplish.map((works: ProjectWorkAccomplish) => ({
            key: works.id,
            label: `For the period of ${dayjs(works.periodStart).format(
              "MMMM DD,YYYY"
            )}  to ${dayjs(works.periodEnd).format("MMMM DD,YYYY")} `,
            children: <WorkAccomplishmentsTable projectId={works?.id} />,
            extra: (
              <Space>
                {works?.status == "LOCKED" && (
                  <Popconfirm
                    placement="topLeft"
                    title="Confirm Adding to Billing"
                    description={
                      <div>
                        <p>Add all selected items to the billing?</p>
                        <p>
                          Once confirmed, items cannot be individually removed.
                        </p>
                      </div>
                    }
                    onConfirm={() => confirmPosting(works?.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      size="small"
                      icon={<SelectOutlined />}
                      style={{ background: "#6435c9" }}
                    />
                  </Popconfirm>
                )}
                <ButtonLock record={works} />

                <Button
                  type="primary"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => props.onHandleEdit(works?.id)}
                />

                <Button
                  type="primary"
                  size="small"
                  icon={<PrinterOutlined />}
                  style={{ background: "orange" }}
                  onClick={() => printPDF(works?.id)}
                />
              </Space>
            ),
            collapsible: "header",
          }))}
          bordered={false}
        />
      </Col>
    </Row>
  )
}
