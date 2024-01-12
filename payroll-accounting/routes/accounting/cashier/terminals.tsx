import React, { useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, App, Button } from "antd";
import TerminalTable from "@/components/accounting/cashier/terminalTable";
import { Query, Terminal } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_RECORD_TERMINAL_LIST } from "@/graphql/cashier/queries";
import _ from "lodash";
import { useDialog } from "@/hooks";
import TerminalForm from "@/components/accounting/cashier/dialog/terminalForm";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function TerminalComponent() {
  const { message } = App.useApp();
  const terminalDialog = useDialog(TerminalForm);
  const [state, setState] = useState({
    filter: "",
  });

  const { data, loading, refetch } = useQuery<Query>(GET_RECORD_TERMINAL_LIST, {
    variables: {
      filter: state.filter,
    },
    fetchPolicy: "cache-and-network",
  });

  const upsertCashierTerminal = (record?: Terminal) => {
    terminalDialog({ record: record }, (result: any) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Cashier Terminals"
      content="Provide a reliable point of service for monetary interactions.">
      <ProCard
        title="Cashier Terminal List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => upsertCashierTerminal()}>
            New Terminal
          </Button>
        }>
        <div className="w-full">
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Search
                size="middle"
                placeholder="Search here.."
                onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              />
            </Col>
            <Col span={24}>
              <TerminalTable
                dataSource={data?.terminalFilter as Terminal[]}
                loading={loading}
                handleOpen={(record) => upsertCashierTerminal(record)}
              />
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  );
}
