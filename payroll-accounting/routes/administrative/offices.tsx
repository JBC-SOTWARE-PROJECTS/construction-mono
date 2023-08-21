import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CompanyTable from "@/components/administrative/company/companyTable";
import { CompanySettings, Office, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_COMPANY_RECORDS } from "@/graphql/company/queries";
import UpsertCompanyModal from "@/components/administrative/company/dialogs/upsertCompanyModal";
import OfficeTable from "@/components/administrative/office/companyTable";

const { Search } = Input;

export default function OfficeComponent() {
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

  const onUpsertRecord = (record?: Office) => {
    modal({ record: record }, (result: any) => {
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
      title="Office Configuration Hub"
      content="Seamlessly manage and configure your list of offices."
    >
      <ProCard
        title="Office List"
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
        <OfficeTable
          dataSource={data?.companyPage?.content as Office[]}
          loading={loading}
          totalElements={data?.companyPage?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
