import React, { useState } from "react";
import { Mutation } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, App } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { IDebitMemoDetails } from "@/interface/payables/formInterfaces";
import { useMutation } from "@apollo/client";
import { REMOVE_DM_DETAILS_RECORD } from "@/graphql/payables/debit-memo-queries";
import update from "immutability-helper";
import DebitMemoTransactionSummaryFooter from "../../common/debitMemoTransactionSummary";
import DebitMemoTransactionModal from "../../dialogs/debitMemoTransactionModal";

interface IProps {
  loading?: boolean;
  parentId?: string;
  dataSource?: IDebitMemoDetails[];
  status?: boolean;
  isVoided?: boolean;
  type: string;
  appliedAmount: number;
  onRefetchData: () => void;
  calculateAmount: (e: number) => void;
  setExpense: React.Dispatch<React.SetStateAction<IDebitMemoDetails[]>>;
}

export default function DebitMemoTransactionTable(props: IProps) {
  const { message } = App.useApp();
  const {
    dataSource,
    parentId,
    onRefetchData,
    appliedAmount,
    calculateAmount,
    type,
    status,
    setExpense,
    loading,
    isVoided,
  } = props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const expenseForm = useDialog(DebitMemoTransactionModal);
  //===================== queries ===================================

  const [removeRecord] = useMutation<Mutation>(REMOVE_DM_DETAILS_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeDmDetails as IDebitMemoDetails;
      if (result.id) {
        message.success("Successfully removed.");
        onRefetchData();
      }
    },
  });
  // ======================== functions ===============================

  const onShowTransaction = (e?: IDebitMemoDetails) => {
    let payload = _.clone(dataSource ?? []) as IDebitMemoDetails[];
    let transactionType = type === "DEBIT_MEMO" ? "DEBITMEMO" : "DEBITADVICE";

    expenseForm(
      { record: e, type: transactionType, appliedAmount: appliedAmount },
      (result: IDebitMemoDetails) => {
        if (!_.isEmpty(result)) {
          if (e?.id) {
            // ======================== update ================================
            let key = (payload || []).findIndex((e) => e.id === result.id);
            let payloadUpdated = update(payload, {
              [key]: {
                transType: {
                  $set: result?.transType,
                },
                office: {
                  $set: result?.office,
                },
                project: {
                  $set: result?.project,
                },
                assets: {
                  $set: result?.assets,
                },
                type: {
                  $set: result?.type,
                },
                percent: {
                  $set: result?.percent,
                },
                amount: {
                  $set: decimalRound2(result?.amount),
                },
                remarks: {
                  $set: result?.remarks,
                },
              },
            });
            let sumAmount: number = _.sumBy(payloadUpdated, "amount");
            calculateAmount(sumAmount);
            setExpense(payloadUpdated ?? []);
          } else {
            // ======================== save ================================
            payload!.push(result);
            let sumAmount: number = _.sumBy(payload, "amount");
            calculateAmount(sumAmount);
            setExpense(payload ?? []);
          }
        }
      }
    );
  };

  const onConfirmRemove = (record: IDebitMemoDetails) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      onRemove(record);
    });
  };

  const onRemove = (record: IDebitMemoDetails) => {
    let payload = _.clone(dataSource);
    if (record.isNew) {
      _.remove(payload || [], function (e) {
        return e.id === record?.id;
      });
      let sumAmount: number = _.sumBy(payload, "amount");
      calculateAmount(sumAmount);
      setExpense(payload ?? []);
      message.success("Sucessfully Removed");
    } else {
      //remove database then refecth
      removeRecord({
        variables: {
          id: record.id,
          parent: parentId,
        },
      });
    }
  };

  // ======================== columns ================================
  const columns: ColumnsType<IDebitMemoDetails> = [
    {
      title: "Transaction Type",
      dataIndex: "transType.description",
      key: "transType.description",
      width: 150,
      render: (_, record) => <span>{record?.transType?.description}</span>,
    },
    {
      title: "Office",
      dataIndex: "office.officeDescription",
      key: "office.officeDescription",
      width: 300,
      render: (_, record) => (
        <span>{record?.office?.officeDescription ?? "--"}</span>
      ),
    },
    {
      title: "Project",
      dataIndex: "project.description",
      key: "project.description",
      width: 300,
      render: (_, record) => (
        <span>{record?.project?.description ?? "--"}</span>
      ),
    },
    {
      title: "Asset",
      dataIndex: "assets.description",
      key: "assets.description",
      width: 300,
      render: (_, record) => <span>{record?.assets?.description ?? "--"}</span>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 350,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      align: "right",
      fixed: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 90,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onShowTransaction(record)}
            disabled={status}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={isVoided ? false : status}
            onClick={() => onConfirmRemove(record)}
          />
        </Space>
      ),
    },
  ];
  // ======================== ends ===================================

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status}
            onClick={() => onShowTransaction()}>
            Add Transaction
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          pageSize: size,
          onShowSizeChange: (_, size) => {
            setSize(size);
          },
        }}
        scroll={{ x: 1700 }}
        summary={() => (
          <DebitMemoTransactionSummaryFooter dataSource={dataSource} />
        )}
      />
    </div>
  );
}
