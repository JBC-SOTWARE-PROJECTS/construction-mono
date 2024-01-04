import { ProjectCost } from "@/graphql/gql/graphql";
import { ExtendedProjectCostRevisions } from "@/interface/projects";
import { REVISIONS_COST } from "@/utility/constant";
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Tag, Button, Typography, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";

interface IProps {
  dataSource: ProjectCost[];
  loading: boolean;
  revesions: any;
  handleOpen: (record: ProjectCost) => void;
  handleRemove: (record: ProjectCost) => void;
  openRevisions: (id: string, desc: string) => void;
}

const { Text } = Typography;

export default function BillQuantitesTable({
  dataSource,
  loading,
  handleOpen,
  handleRemove,
  openRevisions,
  revesions,
}: IProps) {
  // ===================== menus ========================
  const subColmns: ColumnsType<ExtendedProjectCostRevisions> = [
    {
      title: "Date of Prev. Transaction",
      dataIndex: "prevDate",
      key: "prevDate",
      width: 200,
      render: (text) => {
        return <span>{DateFormatterWithTime(text)}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Prev. Qty/Unit",
      dataIndex: "qty",
      key: "qty",
      width: 120,
      align: "center",
      render: (qty, record) => {
        return <span>{`${NumberFormater(qty)} [${record.unit}]`}</span>;
      },
    },
    {
      title: "Prev. Unit Price",
      dataIndex: "cost",
      key: "cost",
      width: 120,
      align: "right",
      render: (cost) => {
        return <span>{NumberFormater(cost)}</span>;
      },
    },
    {
      title: "Prev. Total",
      dataIndex: "totalCost",
      key: "totalCost",
      width: 120,
      align: "right",
      render: (totalCost) => {
        return <span>{NumberFormater(totalCost)}</span>;
      },
    },
    {
      title: "Tag",
      dataIndex: "tagNo",
      key: "tagNo",
      width: 120,
      align: "center",
      render: (tagNo) => {
        let obj = _.find(REVISIONS_COST, { value: tagNo });
        return <Tag color="cyan">{obj?.label}</Tag>;
      },
    },
  ];
  // ===================== columns ========================
  const columns: ColumnsType<ProjectCost> = [
    {
      title: "Date of Transaction",
      dataIndex: "dateTransact",
      key: "dateTransact",
      width: 200,
      render: (text, record) => {
        if (record.status) {
          return <span>{DateFormatterWithTime(text)}</span>;
        } else {
          return (
            <Text delete type="danger">
              {DateFormatterWithTime(text)}
            </Text>
          );
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => {
        if (record.status) {
          return <span>{text}</span>;
        } else {
          return (
            <Text delete type="danger">
              {text}
            </Text>
          );
        }
      },
    },
    {
      title: "Qty/Unit",
      dataIndex: "qty",
      key: "qty",
      width: 120,
      align: "center",
      render: (qty, record) => {
        if (record.status) {
          return <span>{`${NumberFormater(qty)} [${record.unit}]`}</span>;
        } else {
          return (
            <Text delete type="danger">
              {`${NumberFormater(qty)} [${record.unit}]`}
            </Text>
          );
        }
      },
    },
    {
      title: "Unit Price",
      dataIndex: "cost",
      key: "cost",
      width: 120,
      align: "right",
      render: (cost, record) => {
        if (record.status) {
          return <span>{NumberFormater(cost)}</span>;
        } else {
          return (
            <Text delete type="danger">
              {NumberFormater(cost)}
            </Text>
          );
        }
      },
    },
    {
      title: "Tag",
      dataIndex: "tagNo",
      key: "tagNo",
      width: 120,
      align: "center",
      render: (tagNo) => {
        if (tagNo) {
          let obj = _.find(REVISIONS_COST, { value: tagNo });
          return <Tag color="cyan">{obj?.label}</Tag>;
        } else {
          return "--";
        }
      },
    },
    {
      title: "Total",
      dataIndex: "totalCost",
      key: "totalCost",
      width: 120,
      align: "right",
      render: (totalCost, record) => {
        if (record.status) {
          return <span>{NumberFormater(totalCost)}</span>;
        } else {
          return (
            <Text delete type="danger">
              {NumberFormater(totalCost)}
            </Text>
          );
        }
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (text, record) => (
        <Space>
          <Button size="small" type="dashed" onClick={() => handleOpen(record)}>
            <EditOutlined />
          </Button>
          <Button
            size="small"
            danger
            type="dashed"
            onClick={() => handleRemove(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
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
          expandable={{
            onExpand: (expanded, record) => {
              if (expanded) {
                openRevisions(record.id, record.description ?? "");
              }
            },
            expandedRowRender: (record) => (
              <div className="w-full">
                <p style={{ margin: 0, fontWeight: "bold" }}>Revision Logs</p>
                <Table
                  rowKey="id"
                  size="small"
                  columns={subColmns}
                  dataSource={
                    revesions[record.id] as ExtendedProjectCostRevisions[]
                  }
                  pagination={false}
                />
              </div>
            ),
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
