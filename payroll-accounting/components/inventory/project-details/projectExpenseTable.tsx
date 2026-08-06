import { AccountContext } from "@/components/accessControl/AccountContext";
import { ProjectCost } from "@/graphql/gql/graphql";
import { ExtendedProjectCostRevisions } from "@/interface/projects";
import { REVISIONS_COST } from "@/utility/constant";
import {
  DateFormatterWithTime,
  NumberFormater,
  accessControl,
} from "@/utility/helper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button, Typography, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useContext } from "react";

interface IProps {
  dataSource: ProjectCost[];
  loading: boolean;
  revesions: any;
  handleOpen: (record: ProjectCost) => void;
  handleRemove: (record: ProjectCost) => void;
  openRevisions: (id: string, desc: string) => void;
}

const { Text } = Typography;

export default function ProjectExpenseTable({
  dataSource,
  loading,
  handleOpen,
  handleRemove,
  openRevisions,
  revesions,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  console.log("account", account);
  const subColmns: ColumnsType<ExtendedProjectCostRevisions> = [
    {
      title: "Transaction Type",
      dataIndex: "transTypeDescription",
      key: "transTypeDescription",
    },
    {
      title: "Amount",
      dataIndex: "totalNetAmount",
      key: "totalNetAmount",
      width: 120,
      align: "right",
      render: (cost) => {
        return <span>{NumberFormater(cost)}</span>;
      },
    },
    {
      title: "Payable Count",
      dataIndex: "payableCount",
      key: "payableCount",
    },
  ];
  // ===================== columns ========================
  const columns: ColumnsType<ProjectCost> = [
   {
      title: "Transaction Type",
      dataIndex: "transTypeDescription",
      key: "transTypeDescription",
      width: 180,
    },
    {
      title: "Amount",
      dataIndex: "totalNetAmount",
      key: "totalNetAmount",
      width: 120,
      align: "right",
      render: (cost) => {
        return <span>{NumberFormater(cost)}</span>;
      },
    },
    {
      title: "Payable Count",
      dataIndex: "payableCount",
      key: "payableCount",
     width: 120,
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          // expandable={{
          //   onExpand: (expanded, record) => {
          //     if (expanded) {
          //       openRevisions(record.id, record.description ?? "");
          //     }
          //   },
          //   expandedRowRender: (record) => (
          //     <div className="w-full px-5">
          //       <p style={{ margin: 0, fontWeight: "bold" }}>Revision Logs</p>
          //       <Table
          //         rowKey="id"
          //         size="small"
          //         columns={subColmns}
          //         dataSource={
          //           revesions[record.id] as ExtendedProjectCostRevisions[]
          //         }
          //         pagination={false}
          //       />
          //     </div>
          //   ),
          // }}
          loading={loading}
          // scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
