import React, { useState, useEffect } from "react";
import { DisbursementExpense, Mutation, Query } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, App } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { PettyCashOthersDto } from "@/interface/payables/formInterfaces";
import PettyCashOthersSummaryFooter from "../../common/pettyOthersSummary";
import PettyCashOtherModal from "../../dialogs/pettyCashOtherModal";
import { useMutation } from "@apollo/client";
import update from "immutability-helper";
import { REMOVE_PETTYCASH_OTHERS } from "@/graphql/payables/petty-cash-queries";

interface IProps {
  loading?: boolean;
  dataSource?: PettyCashOthersDto[];
  status?: boolean;
  isVoided?: boolean;
  calculateUsedAmount: (e: number) => void;
  setOthers: React.Dispatch<React.SetStateAction<PettyCashOthersDto[]>>;
  onRefetchData: () => void;
}

export default function PettyOthersTable(props: IProps) {
  const { message } = App.useApp();
  const {
    dataSource,
    loading,
    calculateUsedAmount,
    status,
    setOthers,
    isVoided,
    onRefetchData,
  } = props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const expenseForm = useDialog(PettyCashOtherModal);
  //===================== queries ===================================

  const [removeRecord] = useMutation<Mutation>(REMOVE_PETTYCASH_OTHERS, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeOthersById as PettyCashOthersDto;
      if (!_.isEmpty(result?.id)) {
        onRefetchData();
        message.success("Successfully removed.");
      }
    },
  });
  // ======================== functions ===============================

  const onShowTransaction = (e?: PettyCashOthersDto) => {
    let payload = _.clone(dataSource ?? []) as PettyCashOthersDto[];

    expenseForm({ record: e }, (result: PettyCashOthersDto) => {
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
              amount: {
                $set: decimalRound2(result?.amount),
              },
              remarks: {
                $set: result?.remarks,
              },
            },
          });
          let sumAmount: number = _.sumBy(payloadUpdated, "amount");
          calculateUsedAmount(sumAmount);
          setOthers(payloadUpdated ?? []);
        } else {
          // ======================== save ================================
          payload!.push(result);
          let sumAmount: number = _.sumBy(payload, "amount");
          calculateUsedAmount(sumAmount);
          setOthers(payload ?? []);
        }
      }
    });
  };

  const onConfirmRemove = (record: PettyCashOthersDto) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      let status = record?.isNew ?? false;
      onRemove(record?.id, status);
    });
  };

  const onRemove = (id: string, isNew: boolean) => {
    let data = _.clone(dataSource);
    if (isNew) {
      //remove array
      let payload = _.filter(data, (e) => {
        return e.id !== id;
      });
      setOthers(payload);
      message.success("Sucessfully Removed");
    } else {
      //remove database then refecth
      removeRecord({
        variables: {
          id: id,
        },
      });
    }
  };

  // ======================== columns ================================
  const columns: ColumnsType<PettyCashOthersDto> = [
    {
      title: "Transaction Type",
      dataIndex: "transType.description",
      key: "transType.description",
      width: 300,
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

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status}
            onClick={() => onShowTransaction()}>
            Add Other Transaction
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
        scroll={{ x: 1850 }}
        summary={() => <PettyCashOthersSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
