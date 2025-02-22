import { CompanySettings, Employee } from "@/graphql/gql/graphql";
import useUpdateEmployeeStatus from "@/hooks/employee/useUpdateEmployeeStatus";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Switch, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useRouter } from "next/router";

interface IProps {
  dataSource: Employee[];
  loading?: boolean;
  totalElements?: number;
  handleOpen?: (record: CompanySettings) => void;
  changePage?: any;
  rowSelection?: TableRowSelection<Employee>;
  hideExtraColumns?: boolean;
  additionalColumns?: ColumnsType<Employee>;
  refetch?: () => void;
}

export default function EmployeeTable({
  dataSource,
  loading,
  handleOpen,
  refetch,
  changePage,
  rowSelection,
  hideExtraColumns = false,
  additionalColumns,
}: IProps) {
  const router = useRouter();
  const [update, loadingUpdate] = useUpdateEmployeeStatus((e) => {
    if (e.id) {
      if (refetch) refetch();
    }
  });

  const extraColumns: ColumnsType<Employee> = [
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (value, { id }) => {
        return (
          <Switch
            checked={value}
            checkedChildren="Yes"
            unCheckedChildren="No"
            onChange={(status) => {
              update({ id, status });
            }}
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
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => {
              router.push(`/payroll/employees/${id}`);
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
    ...(additionalColumns ? additionalColumns : []),
  ];

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          // pagination={false}
          onChange={changePage}
          loading={loading || loadingUpdate}
          rowSelection={rowSelection}
          // footer={() => (
          //   <Pagination
          //     showSizeChanger={false}
          //     pageSize={10}
          //     responsive={true}
          //     total={totalElements}
          //     onChange={(e) => {
          //       if (changePage) changePage(e - 1);
          //     }}
          //   />
          // )}
          scroll={{ x: 1600 }}
        />
      </Col>
    </Row>
  );
}
