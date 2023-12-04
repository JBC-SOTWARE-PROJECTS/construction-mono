import React, { useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { message } from "antd";
import { ItemSubAccount, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEM_SUB_ACCOUNT } from "@/graphql/inventory/masterfile-queries";
import UpsertItemSubAccountModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertItemSubAccount";
import ItemSubAccountTabComponent from "./sub-account";

export default function ItemSubAccountComponent() {
  const modal = useDialog(UpsertItemSubAccountModal);
  const [state, setState] = useState({
    filter: "",
    type: "ASSET",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_ITEM_SUB_ACCOUNT,
    {
      variables: {
        filter: state.filter,
        type: state.type,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: ItemSubAccount) => {
    modal(
      { record: { ...record, accountType: state?.type } },
      (result: any) => {
        if (result) {
          if (record?.id) {
            message.success("Item Sub Account successfully updated");
          } else {
            message.success("Item Sub Account successfully added");
          }
          refetch();
        }
      }
    );
  };

  const onFilter = (e?: string) => {
    setState((prev: any) => ({ ...prev, filter: e ?? "" }));
  };

  return (
    <PageContainer
      title="Item Subaccount Category Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Item Subaccount Category List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        tabs={{
          type: "line",
          style: { marginLeft: 10, marginRight: 10 },
          onChange: (e) => setState((prev: any) => ({ ...prev, type: e })),
          activeKey: state.type,
        }}>
        <ProCard.TabPane key="ASSET" tab="Asset Subaccount Category">
          <ItemSubAccountTabComponent
            loading={loading}
            data={data?.itemSubAccountList as ItemSubAccount[]}
            onFilter={(e) => onFilter(e)}
            onUpsertRecord={(e) => onUpsertRecord(e)}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="EXPENSE" tab="Expense Subaccount Category">
          <ItemSubAccountTabComponent
            loading={loading}
            data={data?.itemSubAccountList as ItemSubAccount[]}
            onFilter={(e) => onFilter(e)}
            onUpsertRecord={(e) => onUpsertRecord(e)}
          />
        </ProCard.TabPane>
        <ProCard.TabPane
          key="FIXED_ASSET"
          tab="Fixed Asset Subaccount Category">
          <ItemSubAccountTabComponent
            loading={loading}
            data={data?.itemSubAccountList as ItemSubAccount[]}
            onFilter={(e) => onFilter(e)}
            onUpsertRecord={(e) => onUpsertRecord(e)}
          />
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
}
