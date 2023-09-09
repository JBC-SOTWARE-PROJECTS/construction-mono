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
      title: "Office Code",
      dataIndex: "officeCode",
      key: "officeCode",
    },
    {
      title: "Office Name",
      dataIndex: "officeDescription",
      key: "officeDescription",
    },
    {
      title: "Company Name",
      dataIndex: "company.companyName",
      key: "company.companyName",
      render: (text, record) => {
        return <span key={text}>{record.company?.companyName}</span>;
      },
    },
    {
      title: "Office Type",
      dataIndex: "officeType",
      key: "officeType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
