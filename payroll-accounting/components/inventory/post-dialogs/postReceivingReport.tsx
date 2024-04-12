import React, { useMemo, useState } from "react";
import {
  JournalEntryViewDto,
  Query,
  ReceivingReport,
  ReceivingReportItem,
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
import PostInventoryReceivingTable from "./postInventoryReceivingTable";
import {
  CHECKING_PO,
  GET_JOURNAL_RECEIVING_REPORT,
  GET_RECEIVING_ITEMS,
  POST_VOID_RECEIVING_REPORT,
} from "@/graphql/inventory/deliveries-queries";
import {
  formatPostReceivingReport,
  InventoryPostReceivingtList,
} from "@/utility/inventory-helper";

interface IProps {
  hide: (hideProps: any) => void;
  record: ReceivingReport;
  status: boolean;
  viewOnly: boolean;
}

export default function PostReceivingReportModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, status, viewOnly } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [items, setItems] = useState<InventoryPostReceivingtList[]>([]);
  // ===================== Queries ==============================
  const { loading: loadingItems } = useQuery<Query>(GET_RECEIVING_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.recItemByParent ?? []) as ReceivingReportItem[];

      if (!_.isEmpty(result)) {
        let payload = result.map((e, i) => {
          let obj = formatPostReceivingReport(e, record, i);
          console.log("obj", obj);
          return obj;
        });
        setItems(payload);
      }
    },
  });

  const { data, loading } = useQuery<Query>(GET_JOURNAL_RECEIVING_REPORT, {
    variables: {
      id: record?.id,
      status: status,
    },
    fetchPolicy: "cache-and-network",
  });

  const [checkingPO, { loading: checkingPOLoading }] = useMutation(
    CHECKING_PO,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.setToCompleted?.id)) {
          hide("Delivery Receiving Posted");
        }
      },
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    POST_VOID_RECEIVING_REPORT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.receivingPostInventory?.id)) {
          if (record?.purchaseOrder?.id) {
            checkingPO({
              variables: {
                id: record?.purchaseOrder?.id,
              },
            });
          } else {
            hide("Delivery Receiving Updated");
          }
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

  const disabledStatus = useMemo(() => {
    if (record?.isVoid) {
      return true;
    } else {
      return false;
    }
  }, [record]);

  console.log("items", items);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> Delivery Receiving Journal Entry Details
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
              loading={upsertLoading || checkingPOLoading}
              onClick={onSubmit}
              disabled={
                upsertLoading ||
                disabledButton ||
                disabledStatus ||
                checkingPOLoading
              }
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
        expandIcon={() => {
          return <ShoppingCartOutlined />;
        }}
        items={[
          {
            key: "inventory",
            label: "View Inventory Items",
            children: (
              <PostInventoryReceivingTable
                dataSource={items}
                loading={loadingItems}
              />
            ),
          },
        ]}
      />
      <Divider plain>Accounting Journal Entries</Divider>
      <JournaEntriesTable
        entries={data?.receivingAccountView as JournalEntryViewDto[]}
        loading={loading}
      />
    </Modal>
  );
}
