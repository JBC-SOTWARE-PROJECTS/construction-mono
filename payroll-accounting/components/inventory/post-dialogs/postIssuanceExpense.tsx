import React, { useMemo, useState } from "react";
import {
  JournalEntryViewDto,
  Query,
  StockIssue,
  StockIssueItems,
} from "@/graphql/gql/graphql";
import {
  FileDoneOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Modal, Space, Typography, App, Divider, Collapse } from "antd";
import _ from "lodash";
import { useConfirmationPasswordHook } from "@/hooks";
import JournaEntriesTable from "../commons/journalEntriesTable";
import { decimalRound2 } from "@/utility/helper";
import PostInventoryTable from "./postInventoryTable";
import {
  formatPostStockIssuance,
  InventoryPostList,
} from "@/utility/inventory-helper";
import {
  GET_JOURNAL_ITEM_ISSUANCE,
  GET_RECORDS_ISSUANCE_ITEMS,
  POST_VOID_ITEM_ISSUANCE,
} from "@/graphql/inventory/issuance-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record: StockIssue;
  status: boolean;
  viewOnly: boolean;
  title: string;
  showJournal: boolean;
}

export default function PostIssuanceExpenseModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, status, viewOnly, showJournal, title } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [items, setItems] = useState<InventoryPostList[]>([]);
  // ===================== Queries ==============================
  const { loading: loadingItems } = useQuery<Query>(
    GET_RECORDS_ISSUANCE_ITEMS,
    {
      variables: {
        id: record?.id,
      },
      onCompleted: (data) => {
        let result = (data?.stiItemByParent ?? []) as StockIssueItems[];
        if (!_.isEmpty(result)) {
          let payload = [] as InventoryPostList[];
          (result || []).forEach((e, i) => {
            let sti = {} as InventoryPostList;
            let ex = {} as InventoryPostList;
            let sto = {} as InventoryPostList;
            if (record?.issueType === "EXPENSE") {
              if (record?.issueFrom?.id === record?.issueTo?.id) {
                ex = formatPostStockIssuance("EX", e, record, i);
                payload.push(ex);
              } else {
                ex = formatPostStockIssuance("EX", e, record, i);
                sti = formatPostStockIssuance("STI", e, record, i);
                sto = formatPostStockIssuance("STO", e, record, i);
                payload.push(sto);
                payload.push(sti);
                payload.push(ex);
              }
            } else {
              sto = formatPostStockIssuance("STO", e, record, i);
              sti = formatPostStockIssuance("STI", e, record, i);
              payload.push(sto);
              payload.push(sti);
            }
          });
          setItems(payload);
        }
      },
    }
  );

  const { data, loading } = useQuery<Query>(GET_JOURNAL_ITEM_ISSUANCE, {
    variables: {
      id: record?.id,
      status: status,
    },
    fetchPolicy: "cache-and-network",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    POST_VOID_ITEM_ISSUANCE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.postInventoryIssuanceExpense?.id)) {
          let message = "Item Issuance Updated";
          if (record?.issueType === "EXPENSE") {
            message = "Item Expense Updated";
          }
          hide(message);
        } else {
          message.error("Something went wrong. Please contact administrator");
        }
      },
    }
  );

  //================== functions ====================
  const onSubmit = () => {
    showPasswordConfirmation(() => {
      upsertRecord({
        variables: {
          id: record?.id,
          items: items,
          status: status,
        },
      });
    });
  };

  const disabledButton = useMemo(() => {
    let ledger = data?.adjQuantityAccountView as JournalEntryViewDto[];
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));
    const sum = decimalRound2(debit - credit);
    return sum !== 0;
  }, [data?.adjQuantityAccountView]);

  const disabledForm = useMemo(() => {
    if (record?.isCancel) {
      return true;
    } else {
      return false;
    }
  }, [record]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> {title}
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1600px" }}
      onCancel={() => hide(false)}
      footer={
        !viewOnly ? (
          <Space>
            <Button
              type="primary"
              size="large"
              danger={status ? false : true}
              loading={upsertLoading}
              onClick={onSubmit}
              disabled={upsertLoading || disabledButton || disabledForm}
              icon={<SaveOutlined />}>
              {status ? "Post to Inventory" : "Void to Inventory"}
            </Button>
          </Space>
        ) : (
          false
        )
      }>
      <Collapse
        size="small"
        defaultActiveKey={showJournal ? "" : "inventory"}
        expandIcon={() => {
          return <ShoppingCartOutlined />;
        }}
        items={[
          {
            key: "inventory",
            label: "View Inventory Items",
            children: (
              <PostInventoryTable
                dataSource={items}
                loading={loadingItems}
                rowKey="key"
              />
            ),
          },
        ]}
      />
      {showJournal && (
        <React.Fragment>
          <Divider plain>Accounting Journal Entries</Divider>
          <JournaEntriesTable
            entries={data?.issuanceExpenseAccountView as JournalEntryViewDto[]}
            loading={loading}
          />
        </React.Fragment>
      )}
    </Modal>
  );
}
