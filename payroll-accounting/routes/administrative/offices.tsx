import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Office, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_OFFICE_RECORDS } from "@/graphql/offices/queries";
import UpsertOfficeModal from "@/components/administrative/office/dialogs/upsertOfficeModal";
import OfficeTable from "@/components/administrative/office/officeTable";
import { useCompany } from "@/hooks/administrative";

const { Search } = Input;

export default function OfficeComponent() {
  const modal = useDialog(UpsertOfficeModal);
  const [company, setCompany] = useState(null);
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const companies = useCompany();
  const { data, loading, refetch } = useQuery<Query>(GET_OFFICE_RECORDS, {
    variables: {
      filter: state.filter,
      company: company,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Office) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Office successfully added");
        } else {
          message.success("Office successfully updated");
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
            <Select
              allowClear
              options={companies}
              placeholder="Filter Company"
              onChange={(e) => setCompany(e)}
              className="select-header-list"
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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
          </Col>
          <Col span={24}>
            <OfficeTable
              dataSource={data?.officePage?.content as Office[]}
              loading={loading}
              totalElements={data?.officePage?.totalElements as number}
              handleOpen={(record) => onUpsertRecord(record)}
              changePage={(page) =>
                setState((prev) => ({ ...prev, page: page }))
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
