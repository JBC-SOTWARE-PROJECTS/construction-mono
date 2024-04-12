import React, { useMemo, useState } from "react";
import {
  JournalEntryViewDto,
  Query,
  ReturnSupplier,
  ReturnSupplierItem,
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
  GET_JOURNAL_RETURN_SUPPLIER,
  GET_RECORDS_RETURN_ITEMS,
  POST_VOID_RETURN_SUPPLIER,
} from "@/graphql/inventory/deliveries-queries";
import {
  formatPostReturnSupplier,
  InventoryPostList,
} from "@/utility/inventory-helper";

interface IProps {
  hide: (hideProps: any) => void;
  record: ReturnSupplier;
  status: boolean;
  viewOnly: boolean;
}

export default function PostReturnSupplierModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, status, viewOnly } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [items, setItems] = useState<InventoryPostList[]>([]);
  // ===================== Queries ==============================
  const { loading: loadingItems } = useQuery<Query>(GET_RECORDS_RETURN_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.rtsItemByParent ?? []) as ReturnSupplierItem[];
      if (!_.isEmpty(result)) {
        let payload = (result || []).map((e, i) => {
          let obj = formatPostReturnSupplier(e, record, i);
          return obj;
        });
        setItems(payload);
      }
    },
  });

  const { data, loading } = useQuery<Query>(GET_JOURNAL_RETURN_SUPPLIER, {
    variables: {
      id: record?.id,
      status: status,
    },
    fetchPolicy: "cache-and-network",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    POST_VOID_RETURN_SUPPLIER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.postReturnInventory?.id)) {
          hide("Return Supplier Updated");
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

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> Return Supplier Journal Entry Details
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
              disabled={upsertLoading || disabledButton || disabledStatus}
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
              <PostInventoryTable dataSource={items} loading={loadingItems} />
            ),
          },
        ]}
      />
      <Divider plain>Accounting Journal Entries</Divider>
      <JournaEntriesTable
        entries={data?.returnSupplierAccountView as JournalEntryViewDto[]}
        loading={loading}
      />
    </Modal>
  );
}
