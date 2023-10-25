import React, { useState, useEffect } from "react";
import { DisbursementWtx, Mutation, Query } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2 } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, App } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { IDisbursementWTX } from "@/interface/payables/formInterfaces";
import WTXSummaryFooter from "../../common/wtxSummary";
import DisbursementWTXModal from "../../dialogs/disbursementWTXModal";
import {
  GET_DISBURSEMENT_WTX,
  REMOVE_DISBURSEMENT_WTX,
} from "@/graphql/payables/disbursement-queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import update from "immutability-helper";

interface IProps {
  parentId?: string;
  dataSource?: IDisbursementWTX[];
  status?: boolean;
  isVoided?: boolean;
  calculateAmount: (e: number) => void;
  setWtx: React.Dispatch<React.SetStateAction<IDisbursementWTX[]>>;
}

export default function DisbrusementWTXTable(props: IProps) {
  const { message } = App.useApp();
  const { parentId, dataSource, status, calculateAmount, setWtx, isVoided } =
    props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const wtxForm = useDialog(DisbursementWTXModal);
  // ======================= queries ================================
  const [getRecords, { loading }] = useLazyQuery<Query>(GET_DISBURSEMENT_WTX, {
    onCompleted: (data) => {
      let result = data?.disWtxByParent as IDisbursementWTX[];
      let payload = _.clone(dataSource);
      if (_.isEmpty(payload)) {
        setWtx(result);
        let sumAmount: number = _.sumBy(result, "ewtAmount");
        calculateAmount(sumAmount);
      } else {
        let filterNew = _.filter(payload, ["isNew", true]);
        let dataOld = _.filter(payload, (e) => !e.isNew);
        let dataFinal = mappedDataPayload(dataOld, result);

        let concatArray = _.concat(dataFinal, filterNew) as IDisbursementWTX[];
        let sumAmount: number = _.sumBy(concatArray, "ewtAmount");
        calculateAmount(sumAmount);
        setWtx(concatArray);
      }
    },
  });

  const [removeRecord] = useMutation<Mutation>(REMOVE_DISBURSEMENT_WTX, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeWtx as DisbursementWtx;
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
    oldPayload: IDisbursementWTX[],
    resultPayload: IDisbursementWTX[]
  ): IDisbursementWTX[] => {
    let tobeDisplay = [] as IDisbursementWTX[];
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

  const onShowTransaction = (e?: IDisbursementWTX) => {
    let payload = _.clone(dataSource ?? []) as IDisbursementWTX[];

    wtxForm({ record: e }, (result: IDisbursementWTX) => {
      if (!_.isEmpty(result)) {
        if (e?.id) {
          // ======================== update ================================
          let key = (payload || []).findIndex((e) => e.id === result.id);
          let payloadUpdated = update(payload, {
            [key]: {
              appliedAmount: {
                $set: decimalRound2(result?.appliedAmount),
              },
              vatRate: {
                $set: result?.vatRate,
              },
              vatInclusive: {
                $set: result?.vatInclusive,
              },
              vatAmount: {
                $set: decimalRound2(result?.vatAmount),
              },
              ewtDesc: {
                $set: result?.ewtDesc,
              },
              ewtRate: {
                $set: result?.ewtRate,
              },
              ewtAmount: {
                $set: decimalRound2(result?.ewtAmount),
              },
              grossAmount: {
                $set: decimalRound2(result?.grossAmount),
              },
              netAmount: {
                $set: decimalRound2(result?.netAmount),
              },
            },
          });
          let sumAmount: number = _.sumBy(payloadUpdated, "ewtAmount");
          calculateAmount(sumAmount);
          setWtx(payloadUpdated);
        } else {
          // ======================== save ================================
          payload!.push(result);
          let sumAmount: number = _.sumBy(payload, "ewtAmount");
          calculateAmount(sumAmount);
          setWtx(payload);
        }
      }
    });
  };

  const onConfirmRemove = (record: IDisbursementWTX) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      onRemove(record);
    });
  };

  const onRemove = (record: IDisbursementWTX) => {
    let payload = _.clone(dataSource) as IDisbursementWTX[];
    if (record.isNew) {
      _.remove(payload || [], function (e) {
        return e.id === record?.id;
      });
      let sumAmount: number = _.sumBy(payload, "ewtAmount");
      calculateAmount(sumAmount);
      setWtx(payload);
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
  const columns: ColumnsType<IDisbursementWTX> = [
    {
      title: "EWT Description",
      dataIndex: "ewtDesc",
      key: "ewtDesc",
      width: 150,
    },
    {
      title: "EWT Rate",
      dataIndex: "ewtRate",
      key: "ewtRate",
      width: 300,
    },
    {
      title: "Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
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
            Add WTX
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
        summary={() => <WTXSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
