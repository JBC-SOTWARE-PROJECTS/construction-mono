import { AccountContext } from "@/components/accessControl/AccountContext";
import { ProjectUpdatesWorkers, Query } from "@/graphql/gql/graphql";
import { accessControl } from "@/utility/helper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, Typography, Space, App, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useContext } from "react";
import ColTitlePopUp from "../../colTitlePopUp";
import { NumberFormaterNoDecimal } from "@/utility/helper";
import { confirmDelete, useDialog } from "@/hooks";
import { useRouter } from "next/router";
import UpsertAccomplishmentWorkers from "../dialogs/upsertAccomplishmentWorkers";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_RECORD_PROJECT_UPDATES_WORKERS,
  REMOVE_RECORD_PROJECT_WORKERS,
} from "@/graphql/inventory/project-queries";
import { DateFormatterWithTime } from "../../../../utility/helper";

interface IProps {
  projectUpdateId: string;
  isLocked?: boolean;
}

const { Text } = Typography;

export default function ProjectAccomplishmentWorkersTable({
  projectUpdateId,
  isLocked,
}: IProps) {
  // ===================== menus ========================
  const { message } = App.useApp();
  const modal = useDialog(UpsertAccomplishmentWorkers);
  const router = useRouter();
  const { query } = router;
  const account = useContext(AccountContext);
  // ===================== queries ========================
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORD_PROJECT_UPDATES_WORKERS,
    {
      variables: {
        id: projectUpdateId ?? null,
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const [removeRecord, { loading: removeLoading }] = useMutation(
    REMOVE_RECORD_PROJECT_WORKERS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removeProjectUpdateWorkers?.success) {
          message.success(data?.removeProjectUpdateWorkers?.message);
          refetch();
        } else {
          message.error(data?.removeProjectUpdateWorkers?.message);
        }
      },
    }
  );

  const onConfirmRemove = (record: ProjectUpdatesWorkers) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      removeRecord({
        variables: {
          id: record?.id,
        },
      });
    });
  };

  const onUpsertRecord = (record?: ProjectUpdatesWorkers) => {
    modal(
      {
        record: record,
        projectUpdateId: projectUpdateId,
        projectId: query?.id ?? null,
      },
      (result: any) => {
        if (result) {
          message.success(result);
          refetch();
        }
      }
    );
  };

  // ===================== columns ========================
  const columns: ColumnsType<ProjectUpdatesWorkers> = [
    {
      title: "Worker",
      dataIndex: "position",
      key: "position",
    },
    {
      title: (
        <ColTitlePopUp
          descripton="AM"
          popup="Total numbers of workers in morning shift"
        />
      ),
      dataIndex: "amShift",
      key: "amShift",
      width: 120,
      align: "center",
      render: (text) => {
        return <span>{NumberFormaterNoDecimal(text)}</span>;
      },
    },
    {
      title: (
        <ColTitlePopUp
          descripton="PM"
          popup="Total numbers of workers in afternoon shift"
        />
      ),
      dataIndex: "pmShift",
      key: "pmShift",
      width: 120,
      align: "center",
      render: (text) => {
        return <span>{NumberFormaterNoDecimal(text)}</span>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 300,
      render: (text) => {
        return <span>{text ?? "--"}</span>;
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="dashed"
            onClick={() => onUpsertRecord(record)}
            disabled={
              isLocked
                ? accessControl(
                    account?.user?.access,
                    "overwrite_lock_accomplishment"
                  )
                : false
            }>
            <EditOutlined />
          </Button>
          <Button
            size="small"
            danger
            type="dashed"
            disabled={
              isLocked
                ? accessControl(
                    account?.user?.access,
                    "overwrite_lock_accomplishment"
                  )
                : false
            }
            onClick={() => onConfirmRemove(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <div className="w-full dev-right">
          <Button
            type="primary"
            disabled={
              isLocked
                ? accessControl(
                    account?.user?.access,
                    "overwrite_lock_accomplishment"
                  )
                : false
            }
            onClick={() => onUpsertRecord()}>
            Record Number of Workers
          </Button>
        </div>
      </Col>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={data?.pUpdatesWorkersByList as ProjectUpdatesWorkers[]}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="w-full px-5">
                <p style={{ padding: 0 }}>
                  <span className="font-bold">Date Added:&nbsp;</span>
                  <span>{DateFormatterWithTime(record?.dateTransact)}</span>
                </p>
                <p style={{ padding: 0 }}>
                  <span className="font-bold">Created By:&nbsp;</span>
                  <span>
                    <Tag color="green">{record?.createdBy}</Tag>
                  </span>
                </p>
                <p style={{ padding: 0 }}>
                  <span className="font-bold">Last Modified By:&nbsp;</span>
                  <span>
                    <Tag color="orange">{record?.lastModifiedBy}</Tag>
                  </span>
                </p>
                <p style={{ padding: 0 }}>
                  <span className="font-bold">Last Modified Date:&nbsp;</span>
                  <span>{DateFormatterWithTime(record?.lastModifiedDate)}</span>
                </p>
              </div>
            ),
          }}
          loading={loading || removeLoading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
