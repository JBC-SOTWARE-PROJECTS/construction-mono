import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, App } from "antd";
import { GET_EXP_TRANSACTION_TYPES } from "@/graphql/payables/config-queries";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { ExpenseTransaction, Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { useDialog } from "@/hooks";
import ExpenseTransactionTypeModal from "@/components/accounting/payables/dialogs/expenseTransactionModal";
import DisbursementTypeTable from "@/components/accounting/payables/config/disbursementTypeTable";

const { Search } = Input;

export default function DebitAdviceTransactionComponent() {
  const { message } = App.useApp();
  const modal = useDialog(ExpenseTransactionTypeModal);

  const [state, setState] = useState({
    filter: "",
  });

  const { data, loading, refetch } = useQuery<Query>(
    GET_EXP_TRANSACTION_TYPES,
    {
      variables: {
        type: "DEBITADVICE",
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const upsertShowModal = (record?: ExpenseTransaction) => {
    let payload = { ...record, type: "DEBITADVICE" };
    modal({ record: payload }, (result: any) => {
      if (result) {
        refetch();
        message.success(result?.message);
      }
    });
  };

  return (
    <PageContainer title="Debit Advice Transaction Type Configuration">
      <ProCard
        title="Debit Advice type Transaction"
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
              onSearch={(e) =>
                setState((prev) => ({ ...prev, filter: e, page: 0 }))
              }
              className="select-header"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => upsertShowModal()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <DisbursementTypeTable
          dataSource={data?.transTypeByType as ExpenseTransaction[]}
          loading={loading}
          handleOpen={(record) => upsertShowModal(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
