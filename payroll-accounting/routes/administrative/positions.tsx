import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Position, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_POSITION_RECORDS } from "@/graphql/positions/queries";
import UpsertPositionModal from "@/components/administrative/positions/dialogs/upsertPositionModal";
import PositionTable from "@/components/administrative/positions/positionTable";

const { Search } = Input;

export default function OfficeComponent() {
  const modal = useDialog(UpsertPositionModal);
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const { data, loading, refetch } = useQuery<Query>(GET_POSITION_RECORDS, {
    variables: {
      filter: state.filter,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Position) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Position successfully added");
        } else {
          message.success("Position successfully updated");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Job Designation Optimization"
      content="Optimize your position list for coherent job designations."
    >
      <ProCard
        title="Position List"
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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <PositionTable
              dataSource={data?.positionPage?.content as Position[]}
              loading={loading}
              totalElements={data?.positionPage?.totalElements as number}
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
