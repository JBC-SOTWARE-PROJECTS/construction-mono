import { Office } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Office[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Office) => void;
  changePage: (page: number) => void;
}

export default function OfficeTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<Office> = [
    {
      title: "Company Code",
      dataIndex: "companyCode",
      key: "companyCode",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Company Vat Rate",
      dataIndex: "vatRate",
      key: "vatRate",
    },
    {
      title: "Hide in Selection",
      dataIndex: "hideInSelection",
      key: "hideInSelection",
      align: "center",
      render: (text) => {
        let color = "blue";
        if (text) {
          color = "green";
        }
        return <Tag color={color}>{text ? "Yes" : "No"}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      fixed: "right",
      width: 90,
      render: (text) => {
        let color = "red";
        if (text) {
          color = "green";
        }
        return <Tag color={color}>{text ? "Active" : "Inactive"}</Tag>;
      },
    },

    {
      title: "#",
      key: "action",
      width: 50,
      fixed: "right",
      render: (text, record) => (
        <Button
          key={text}
          type="dashed"
          size="small"
          onClick={() => handleOpen(record)}
          icon={<FolderOpenOutlined />}
        />
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
          pagination={false}
          loading={loading}
          footer={() => (
            <Pagination
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={totalElements}
              onChange={(e) => {
                changePage(e - 1);
              }}
            />
          )}
        />
      </Col>
    </Row>
  );
}
