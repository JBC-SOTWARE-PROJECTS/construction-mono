import React, { useState, useEffect } from "react";
import { DisbursementCheck, Mutation, Query } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, App } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import dayjs from "dayjs";
import CheckSummaryFooter from "../../common/checksSummary";
import {
  GET_DISBURSEMENT_CHECKS,
  REMOVE_DISBURSEMENT_CHECK,
} from "@/graphql/payables/disbursement-queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import DisbursementChecksModal from "../../dialogs/checksModal";
import { ICheckDetails } from "@/interface/payables/formInterfaces";
import update from "immutability-helper";

interface IProps {
  parentId?: string | undefined | null;
  dataSource?: ICheckDetails[];
  status?: boolean;
  isVoided?: boolean;
  calculateAmount: (e: number, a: string) => void;
  setChecks: React.Dispatch<React.SetStateAction<ICheckDetails[]>>;
}

export default function ChecksTable(props: IProps) {
  const { message } = App.useApp();
  const { parentId, dataSource, status, setChecks, calculateAmount, isVoided } =
    props;
  const [size, setSize] = useState<number>(5);
  // ======================== Modals ================================
  const addChecks = useDialog(DisbursementChecksModal);
  // ======================== Queries ================================
  const [getRecords, { loading }] = useLazyQuery<Query>(
    GET_DISBURSEMENT_CHECKS,
    {
      onCompleted: (data) => {
        let result = data?.disCheckByParent as ICheckDetails[];
        let payload = _.clone(dataSource);
        if (_.isEmpty(payload)) {
          setChecks(result);
          let sumAmount: number = _.sumBy(result, "amount");
          calculateAmount(sumAmount, "CHECK");
        } else {
          let filterNew = _.filter(payload, ["isNew", true]);
          let dataOld = _.filter(payload, (e) => !e.isNew);
          let dataFinal = mappedDataPayload(dataOld, result);

          let concatArray = _.concat(dataFinal, filterNew) as ICheckDetails[];
          let sumAmount: number = _.sumBy(concatArray, "amount");
          calculateAmount(sumAmount, "CHECK");
          setChecks(concatArray);
        }
      },
    }
  );

  const [removeRecord] = useMutation<Mutation>(REMOVE_DISBURSEMENT_CHECK, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeCheck as DisbursementCheck;
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

  //========================= functions =============================
  const mappedDataPayload = (
    oldPayload: ICheckDetails[],
    resultPayload: ICheckDetails[]
  ): ICheckDetails[] => {
    let tobeDisplay = [] as ICheckDetails[];
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

  const showModal = (record?: ICheckDetails) => {
    addChecks({ record: record }, function (result: ICheckDetails) {
      let payload = _.clone(dataSource);
      if (!_.isEmpty(result)) {
        if (record?.id) {
          // ======================== update ================================
          let key = (payload || []).findIndex((e) => e.id === result.id);
          let payloadUpdated = update(payload, {
            [key]: {
              bank: {
                $set: result?.bank,
              },
              bankBranch: {
                $set: result?.bankBranch,
              },
              checkNo: {
                $set: result?.checkNo,
              },
              checkDate: {
                $set: result?.checkDate,
              },
              amount: {
                $set: result?.amount,
              },
            },
          });
          let sumAmount: number = _.sumBy(payloadUpdated, "amount");
          calculateAmount(sumAmount, "CHECK");
          setChecks(payloadUpdated ?? []);
        } else {
          // ======================== save ================================
          payload!.push(result);
          let sumAmount: number = _.sumBy(payload, "amount");
          calculateAmount(sumAmount, "CHECK");
          setChecks(payload ?? []);
        }
      }
    });
  };

  const onConfirmRemove = (record: ICheckDetails) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      onRemove(record);
    });
  };

  const onRemove = (record: ICheckDetails) => {
    let payload = _.clone(dataSource);
    if (record.isNew) {
      _.remove(payload || [], function (e) {
        return e.id === record?.id;
      });
      let sumAmount: number = _.sumBy(payload, "amount");
      calculateAmount(sumAmount, "CHECK");
      setChecks(payload ?? []);
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
  const columns: ColumnsType<ICheckDetails> = [
    {
      title: "Bank",
      dataIndex: "bank.bankname",
      key: "bank.bankname",
      width: 350,
      render: (_, record) => <span>{record?.bank?.bankname}</span>,
    },
    {
      title: "Branch Name",
      dataIndex: "bankBranch",
      key: "bankBranch",
      width: 250,
    },
    {
      title: "Check #",
      dataIndex: "checkNo",
      key: "checkNo",
      width: 200,
    },
    {
      title: "Check Date",
      dataIndex: "discRate",
      key: "discRate",
      width: 100,
      render: (_, record) => (
        <span>{dayjs(record.checkDate).format("MM/DD/YYYY")}</span>
      ),
    },
    {
      title: "Check Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      align: "right",
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
            onClick={() => showModal(record)}
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
            onClick={() => showModal()}>
            Add Check
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
        summary={() => <CheckSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
