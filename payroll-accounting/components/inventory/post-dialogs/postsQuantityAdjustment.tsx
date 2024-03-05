import React, { useMemo } from "react";
import { QuantityAdjustment } from "@/graphql/gql/graphql";
import { FileDoneOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  App,
  Table,
  Divider,
} from "antd";
import _ from "lodash";
import { UPSERT_STATUS_ADJUSTMENT } from "@/graphql/inventory/adjustments-queries";
import { useConfirmationPasswordHook } from "@/hooks";
import JournaEntriesTable from "../commons/journalEntriesTable";
import { decimalRound2 } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  record: QuantityAdjustment;
}

const ledger = [
  {
    code: "119-10000-0000",
    desc: "PREPAID TAXES-INPUT VAT",
    debit: 1948.96,
    credit: 0,
  },
  {
    code: "109-0052-02000",
    desc: "	INVENTORY-MATERIAL MANAGEMENT-MEDICAL, DENTAL AND LABORATORY SUPPLIES",
    debit: 0,
    credit: 1948.96,
  },
];

export default function PostQuantityAdjustmentModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ===================== Queries ==============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_STATUS_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.updateQtyAdjStatus?.id)) {
          hide("Quantity Adjustment Posted");
        }
      },
    }
  );

  //================== functions ====================
  const onSubmit = () => {
    showPasswordConfirmation(() => {
      upsertRecord({
        variables: {
          remarks: "",
          id: record?.id,
        },
      });
    });
  };

  const disabledButton = useMemo(() => {
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));
    const sum = decimalRound2(debit - credit);
    return sum !== 0;
  }, [ledger]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> Quantity Adjustment Journal Entry Details
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1400px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            loading={upsertLoading}
            onClick={onSubmit}
            disabled={upsertLoading || disabledButton}
            icon={<SaveOutlined />}>
            Post to Inventory
          </Button>
        </Space>
      }>
      <Divider plain>Accounting Journal Entries</Divider>
      <JournaEntriesTable entries={ledger} loading={false} />
    </Modal>
  );
}
