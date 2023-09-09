import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CompanyTable from "@/components/administrative/company/companyTable";
import { CompanySettings, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_COMPANY_RECORDS } from "@/graphql/company/queries";
import UpsertCompanyModal from "@/components/administrative/company/dialogs/upsertCompanyModal";

const { Search } = Input;

export default function CompanyComponent() {
  const modal = useDialog(UpsertCompanyModal);
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });

  const { data, loading, refetch } = useQuery<Query>(GET_COMPANY_RECORDS, {
    variables: {
      filter: state.filter,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: CompanySettings) => {
    modal({ record: record }, (result: boolean) => {
      if (result) {
        if (record?.id) {
          message.success("Company successfully added");
        } else {
          message.success("Company successfully updated");
        }
        refetch();
      }
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
              onClick={() => onUpsertRecord()}
            >
              Create New
            </Button>
          </ProFormGroup>
        }
      >
        <CompanyTable
          dataSource={data?.companyPage?.content as CompanySettings[]}
          loading={loading}
          totalElements={data?.companyPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
