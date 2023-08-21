import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import { Employee } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter, useGetFilters } from "@/hooks/employee";
import { IPageProps } from "@/utility/interfaces";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Button, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

const { Search } = Input;
const filterOptions = [
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

export default function EmployeesPage({ account }: IPageProps) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const [filterData] = useGetFilters();
  const { loading, data, refetch } = useGetEmployeesByFilter({
    variables: {
      filter: state.filter,
      status: state.status,
      office: state.office,
      position: state.position,
    },
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
              <Search
                size="middle"
                placeholder="Search here.."
                onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                className="select-header"
              />
              <Select
                allowClear
                style={{ width: 170 }}
                placeholder="Office"
                defaultValue={null}
                onChange={(value) => {
                  setState({ ...state, status: value });
                }}
                options={filterOptions}
              />
              <Select
                allowClear
                style={{ width: 170 }}
                placeholder="Office"
                defaultValue={null}
                onChange={(value) => {
                  setState({ ...state, office: value });
                }}
                options={filterData?.office}
              />
              <Select
                allowClear
                style={{ width: 170 }}
                placeholder="Position"
                defaultValue={null}
                onChange={(value) => {
                  setState({ ...state, position: value });
                }}
                options={filterData.position}
              />
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
          {/* <EmployeeList emplist={data} onUpdateStatus={() => {}} /> */}
          <EmployeeTable
            dataSource={data as Employee[]}
            loading={false}
            totalElements={1 as number}
            handleOpen={(record) => console.log("record => ", record)}
            changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
          />
        </ProCard>
      }
    ></PageContainer>
  );
}
