import { CompanySettings, Employee } from "@/graphql/gql/graphql";
import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useRouter } from "next/router";

interface IProps {
  dataSource: Employee[];
  loading?: boolean;
  totalElements: number;
  handleOpen: (record: CompanySettings) => void;
  changePage?: (page: number) => void;
  rowSelection?: TableRowSelection<Employee>;
  hideExtraColumns?: boolean;
}

export default function EmployeeTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
  rowSelection,
  hideExtraColumns = false,
}: IProps) {
  const router = useRouter();

  const extraColumns: ColumnsType<Employee> = [
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) => {
        return (
          <Switch
            checked={value}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => {
        return (
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              router.push(`/administrative/employees/manage/${id}`);
            }}
          />
        );
      },
    },
  ];

  const columns: ColumnsType<Employee> = [
    {
      title: "Employee No",
      dataIndex: "employeeNo",
      key: "employeeNo",
      width: 160,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Position",
      dataIndex: ["position", "description"],
      key: "position",
    },
    {
      title: "Office",
      dataIndex: ["office", "officeDescription"],
      key: "office",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    ...(!hideExtraColumns ? extraColumns : []),
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
          rowSelection={rowSelection}
          footer={() => (
            <Pagination
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={totalElements}
              onChange={(e) => {
                if (changePage) changePage(e - 1);
              }}
            />
          )}
          scroll={{ x: 1600 }}
        />
      </Col>
    </Row>
  );
}
