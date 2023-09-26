import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import CustomButton from "@/components/common/CustomButton";
import EmployeeFilter from "@/components/common/EmployeeFilter";
import { Employee } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import { IPageProps } from "@/utility/interfaces";
import { UnorderedListOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { startCase, toLower } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";

const { Search } = Input;
interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

export default function ScheduleTypeSetup({ account }: IPageProps) {
  const [employees, loading, setFilters] = useGetEmployeesByFilter({
    fetchPolicy: "network-only",
  });
  const router = useRouter();
  let columns: ColumnsType<Employee> = [
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (value: string) => {
        return (
          <CustomButton
            onClick={() => {
              router.push(`/payroll/employee-management/attendance/${value}`);
            }}
            shape="circle"
            type="primary"
            icon={<UnorderedListOutlined />}
          />
        );
      },
    },
  ];

  return (
    <PageContainer title="Employee Attendance">
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        extra={
          <ProFormGroup>
            <EmployeeFilter setFilters={setFilters} />
          </ProFormGroup>
        }
      >
        <Head>
          <title>Employee Attendance</title>
        </Head>

        <EmployeeTable
          dataSource={employees as Employee[]}
          loading={loading}
          totalElements={1 as number}
          changePage={(page) =>
            setFilters((prev: any) => ({ ...prev, page: page }))
          }
          hideExtraColumns
          additionalColumns={columns}
        />
      </ProCard>
    </PageContainer>
  );
}
