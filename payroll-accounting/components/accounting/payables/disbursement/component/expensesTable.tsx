import React, { useState, useEffect } from "react";
import { DisbursementExpense, Mutation, Query } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, App } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { IDisbursementExpense } from "@/interface/payables/formInterfaces";
import ExpenseSummaryFooter from "../../common/expenseSummary";
import DisbursementExpenseModal from "../../dialogs/disbursementExpenseModal";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_DISBURSEMENT_EXPENSE,
  REMOVE_DISBURSEMENT_EXPENSE,
} from "@/graphql/payables/disbursement-queries";
import update from "immutability-helper";

interface IProps {
  parentId?: string;
  dataSource?: IDisbursementExpense[];
  status?: boolean;
  isVoided?: boolean;
  calculateAmount: (e: number) => void;
  setExpense: React.Dispatch<React.SetStateAction<IDisbursementExpense[]>>;
}

export default function DisbrusementExepnseTable(props: IProps) {
  const { message } = App.useApp();
  const {
    dataSource,
    parentId,
    calculateAmount,
    status,
    setExpense,
    isVoided,
  } = props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const expenseForm = useDialog(DisbursementExpenseModal);
  //===================== queries ===================================
  const [getRecords, { loading }] = useLazyQuery<Query>(
    GET_DISBURSEMENT_EXPENSE,
    {
      onCompleted: (data) => {
        let result = data?.disExpByParent as IDisbursementExpense[];
        let payload = _.clone(dataSource);
        if (_.isEmpty(payload)) {
          setExpense(result);
          let sumAmount: number = _.sumBy(result, "amount");
          calculateAmount(sumAmount);
        } else {
          let filterNew = _.filter(payload, ["isNew", true]);
          let dataOld = _.filter(payload, (e) => !e.isNew);
          let dataFinal = mappedDataPayload(dataOld, result);

          let concatArray = _.concat(dataFinal, filterNew);
          let sumAmount: number = _.sumBy(concatArray, "amount");
          calculateAmount(sumAmount);
          setExpense(concatArray);
        }
      },
    }
  );

  const [removeRecord] = useMutation<Mutation>(REMOVE_DISBURSEMENT_EXPENSE, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeExpense as DisbursementExpense;
      if (!_.isEmpty(result?.id)) {
        message.success("Successfully removed.");
        getRecords({
          variables: {
            id: parentId,
          },
        });
      }
    },
  });
  // ======================== functions ===============================
  const mappedDataPayload = (
    oldPayload: IDisbursementExpense[],
    resultPayload: IDisbursementExpense[]
  ): IDisbursementExpense[] => {
    let tobeDisplay = [] as IDisbursementExpense[];
    if (_.isEmpty(resultPayload)) {
      tobeDisplay = resultPayload;
    } else {
      if (!_.isEmpty(oldPayload)) {
        tobeDisplay = _.filter(oldPayload, (e) => {
          let record = _.find(resultPayload, { id: e.id });
          return !_.isEmpty(record);
        });
      }
    }
    return tobeDisplay;
  };
  const onShowTransaction = (e?: IDisbursementExpense) => {
    let payload = _.clone(dataSource ?? []) as IDisbursementExpense[];

    expenseForm({ record: e }, (result: IDisbursementExpense) => {
      if (!_.isEmpty(result)) {
        if (e?.id) {
          // ======================== update ================================
          let key = (payload || []).findIndex((e) => e.id === result.id);
          let payloadUpdated = update(payload, {
            [key]: {
              transType: {
                $set: result?.transType,
              },
              project: {
                $set: result?.project,
              },
              office: {
                $set: result?.office,
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
    });
  };

  const onConfirmRemove = (record: IDisbursementExpense) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      onRemove(record);
    });
  };

  const onRemove = (record: IDisbursementExpense) => {
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
  const columns: ColumnsType<IDisbursementExpense> = [
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
      render: (_, record) => <span>{record?.office?.officeDescription}</span>,
    },
    {
      title: "Project",
      dataIndex: "project.description",
      key: "project.description",
      width: 300,
      render: (_, record) => <span>{record?.project?.description}</span>,
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
  useEffect(() => {
    if (parentId) {
      getRecords({
        variables: {
          id: parentId,
        },
      });
    }
  }, [parentId]);

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status}
            onClick={() => onShowTransaction()}>
            Add Expense
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
        scroll={{ x: 1400 }}
        summary={() => <ExpenseSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
