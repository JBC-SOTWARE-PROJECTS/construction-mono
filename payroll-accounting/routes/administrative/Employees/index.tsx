import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import EmployeeFilter from "@/components/common/EmployeeFilter";
import { Employee } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import { IPageProps } from "@/utility/interfaces";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Button, Input } from "antd";
import { useRouter } from "next/router";

export const filterOptions = [
  {
    value: null,
    label: "All Employee",
    icon: "all-contacts",
  },
  {
    value: true,
    label: "Active Employee",
    icon: "check-circle-o",
  },
  {
    value: false,
    label: "Inactive Employee",
    icon: "close-circle",
  },
];
export interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

export default function EmployeesPage({ account }: IPageProps) {
  const router = useRouter();
  const [data, loading, setFilters] = useGetEmployeesByFilter({
    fetchPolicy: "network-only",
  });

  const onAddEmployee = () => {
    router.push(`/administrative/employees/manage`);
  };

  return (
    <PageContainer
      title="Employee Database Center"
      content={
        <ProCard
          title="Employee List"
          headStyle={{
            flexWrap: "wrap",
          }}
          bordered
          headerBordered
          extra={
            <ProFormGroup>
              <EmployeeFilter setFilters={setFilters} />
              <Button
                type="primary"
                onClick={onAddEmployee}
                icon={<PlusCircleOutlined />}
              >
                Create New
              </Button>
            </ProFormGroup>
          }
        >
          <EmployeeTable
            dataSource={data as Employee[]}
            loading={loading}
            totalElements={1 as number}
            handleOpen={(record) => console.log("record => ", record)}
            changePage={(page) =>
              setFilters((prev: any) => ({ ...prev, page: page }))
            }
          />
        </ProCard>
      }
    ></PageContainer>
  );
}
