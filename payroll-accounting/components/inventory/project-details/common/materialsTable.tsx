import { AccountContext } from "@/components/accessControl/AccountContext";
import { ProjectUpdatesMaterials, Query } from "@/graphql/gql/graphql";
import { accessControl } from "@/utility/helper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, App, Button, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useContext } from "react";
import ColTitlePopUp from "../../colTitlePopUp";
import { NumberFormaterNoDecimal } from "@/utility/helper";
import { useDialog } from "@/hooks";
import { GET_RECORD_PROJECT_UPDATES_MATERIALS } from "@/graphql/inventory/project-queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import UpsertAccomplishmentMaterials from "../dialogs/upsertAccomplishmentMaterials";
import { AppContext } from "@/components/accessControl/AppContext";

interface IProps {
  projectUpdateId: string;
}

export default function ProjectAccomplishmentMaterialsTable({
  projectUpdateId,
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
      title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
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
            onClick={() => console.log(record)}
            disabled={accessControl(
              account.user?.access || [],
              "bill_of_quantities_revision"
            )}>
            <EditOutlined />
          </Button>
          <Button
            size="small"
            danger
            type="dashed"
            onClick={() => console.log(record)}
            disabled={accessControl(
              account.user?.access || [],
              "add_bill_of_quantities"
            )}>
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
          <Button type="primary" onClick={() => onUpsertRecord()}>
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
            expandedRowRender: (record: ProjectUpdatesMaterials) => (
              <div className="w-full px-5"></div>
            ),
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
