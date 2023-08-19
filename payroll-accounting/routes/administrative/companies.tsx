import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CompanyTable from "@/components/administrative/company/companyTable";
import { CompanySettings } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { useDialog } from "@/hooks";

const { Search } = Input;

export default function CompanyComponent() {
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });

  //   const { data, loading } = useQuery<Query>(GET_RECORDS_PAYABLES, {
  //     variables: {
  //       filter: state.filter,
  //       supplier: supplier?.value,
  //       status: state.status,
  //       start: dateToString(filterDates.start),
  //       end: dateEndToString(filterDates.end),
  //       page: state.page,
  //       size: state.size,
  //     },
  //     fetchPolicy: "cache-and-network",
  //   });

  console.log("state => ", state);

  const onShowPassword = () => {
    showPasswordConfirmation(() => {
      alert("asdasdasd");
    });
  };

  return (
    <PageContainer
      title="Company List Management Hub"
      content="Streamline and manage your list of companies effortlessly."
    >
      <ProCard
        title="Company List"
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
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={onShowPassword}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      >
        <CompanyTable
          dataSource={[] as CompanySettings[]}
          loading={false}
          totalElements={1 as number}
          handleOpen={(record) => console.log("record => ", record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
