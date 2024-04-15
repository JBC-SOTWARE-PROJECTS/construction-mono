import { AccountContext } from "@/components/accessControl/AccountContext";
import { ProjectUpdatesMaterials, Query } from "@/graphql/gql/graphql";
import { DateFormatterWithTime } from "@/utility/helper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, App, Button, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useContext } from "react";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { NumberFormaterNoDecimal } from "@/utility/helper";
import { confirmDelete, useDialog } from "@/hooks";
import {
  GET_RECORD_PROJECT_UPDATES_MATERIALS,
  REMOVE_MATERIAL,
} from "@/graphql/inventory/project-queries";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import UpsertAccomplishmentMaterials from "../dialogs/upsertAccomplishmentMaterials";
import { AppContext } from "@/components/accessControl/AppContext";
import AccessControl from "@/components/accessControl/AccessControl";

interface IProps {
  projectUpdateId: string;
  isLocked?: boolean;
}

export default function ProjectAccomplishmentMaterialsTable({
  projectUpdateId,
  isLocked,
}: IProps) {
  const { message } = App.useApp();
  const account = useContext(AccountContext);
  const { projectInfo } = useContext(AppContext);
  const modal = useDialog(UpsertAccomplishmentMaterials);
  const router = useRouter();
  const { query } = router;
  // ===================== queries ========================
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORD_PROJECT_UPDATES_MATERIALS,
    {
      variables: {
        id: projectUpdateId ?? null,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    REMOVE_MATERIAL,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removedMaterial?.id) {
          message.success("Material successfully deleted");
          refetch();
        } else {
          message.error("Something went wrong. Please contact administrator");
        }
      },
    }
  );

  const onConfirmRemove = (record: ProjectUpdatesMaterials) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      removeRecord({
        variables: {
          id: record?.id,
        },
      });
    });
  };

  const onUpsertRecord = (record?: ProjectUpdatesMaterials) => {
    modal(
      {
        record: record,
        projectUpdateId: projectUpdateId,
        projectId: query?.id ?? null,
        officeId: projectInfo?.location?.id,
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
  const columns: ColumnsType<ProjectUpdatesMaterials> = [
    {
      title: "Item Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 150,
    },
    {
      title: "On Hand Qty",
      dataIndex: "onHand",
      key: "onHand",
      width: 120,
      align: "right",
      render: (text) => {
        return <span>{NumberFormaterNoDecimal(text)}</span>;
      },
    },
    {
      title: "Used",
      dataIndex: "qty",
      key: "qty",
      width: 120,
      align: "right",
      render: (qty) => {
        return <span>{`${NumberFormaterNoDecimal(qty)}`}</span>;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      align: "right",
      render: (balance) => {
        return <span>{NumberFormaterNoDecimal(balance)}</span>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 200,
      render: (remarks) => {
        return <span>{remarks ?? "--"}</span>;
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
          <AccessControl allowedPermissions={["overwrite_lock_accomplishment"]}>
            <Button
              size="small"
              type="dashed"
              disabled={isLocked}
              onClick={() => onUpsertRecord(record)}>
              <EditOutlined />
            </Button>
          </AccessControl>
          <Button
            size="small"
            danger
            type="dashed"
            onClick={() => onConfirmRemove(record)}
            disabled={isLocked}>
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
            disabled={isLocked}
            onClick={() => onUpsertRecord()}>
            Record Used Materials
          </Button>
        </div>
      </Col>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={
            data?.getProjectMaterialsByMilestone as ProjectUpdatesMaterials[]
          }
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
