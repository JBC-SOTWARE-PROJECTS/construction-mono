import React, { useState, useEffect } from "react";
import { DisbursementPettyCash, Mutation, Query } from "@/graphql/gql/graphql";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater, decimalRound2 } from "@/utility/helper";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, App, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { IDisbursementPCV } from "@/interface/payables/formInterfaces";
import DisbursementWTXModal from "../../dialogs/disbursementWTXModal";
import {
  GET_DISBURSEMENT_PCV,
  REMOVE_DISBURSEMENT_PCV,
} from "@/graphql/payables/disbursement-queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import update from "immutability-helper";
import PCVApplicationFooter from "../../common/pcvApplicationSummary";
import PettyCashListSelectorModal from "../../dialogs/pcvListModal";

interface IProps {
  parentId?: string;
  dataSource?: IDisbursementPCV[];
  status?: boolean;
  isVoided?: boolean;
  calculateAmount: (e: number) => void;
  setPCV: React.Dispatch<React.SetStateAction<IDisbursementPCV[]>>;
}

export default function PettyCashApplicationTable(props: IProps) {
  const { message, modal } = App.useApp();
  const { confirm } = modal;
  const { parentId, dataSource, status, calculateAmount, setPCV, isVoided } =
    props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const pcvPost = useDialog(PettyCashListSelectorModal);
  // ======================= queries ================================
  const [getRecords, { loading }] = useLazyQuery<Query>(GET_DISBURSEMENT_PCV, {
    onCompleted: (data) => {
      let result = data?.disPettyByParent as IDisbursementPCV[];
      let payload = _.clone(dataSource);
      if (_.isEmpty(payload)) {
        setPCV(result);
        let sumAmount: number = _.sumBy(result, "amount");
        calculateAmount(sumAmount);
      } else {
        let filterNew = _.filter(payload, ["isNew", true]);
        let dataOld = _.filter(payload, (e) => !e.isNew);
        let dataFinal = mappedDataPayload(dataOld, result);

        let concatArray = _.concat(dataFinal, filterNew) as IDisbursementPCV[];
        let sumAmount: number = _.sumBy(concatArray, "amount");
        calculateAmount(sumAmount);
        setPCV(concatArray);
      }
    },
  });

  const [removeRecord] = useMutation<Mutation>(REMOVE_DISBURSEMENT_PCV, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeWtx as DisbursementPettyCash;
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
    oldPayload: IDisbursementPCV[],
    resultPayload: IDisbursementPCV[]
  ): IDisbursementPCV[] => {
    let tobeDisplay = [] as IDisbursementPCV[];
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

  const onShowTransaction = () => {
    pcvPost({ payload: dataSource }, (result: IDisbursementPCV[]) => {
      if (!_.isEmpty(result)) {
        console.log("result", result);
        setPCV(result);
      }
    });
  };

  const onConfirmRemove = (record: IDisbursementPCV) => {
    confirm({
      title: "Delete Confirmation",
      icon: <ExclamationCircleFilled />,
      content: `Are you certain you want to remove this record?.`,
      onOk: () => {
        onRemove(record);
      },
    });
  };

  const onRemove = (record: IDisbursementPCV) => {
    let payload = _.clone(dataSource) as IDisbursementPCV[];
    if (record.isNew) {
      _.remove(payload || [], function (e) {
        return e.id === record?.id;
      });
      let sumAmount: number = _.sumBy(payload, "amount");
      calculateAmount(sumAmount);
      setPCV(payload);
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
  const columns: ColumnsType<IDisbursementPCV> = [
    {
      title: "PCV Date",
      dataIndex: "pcvDate",
      key: "pcvDate",
      width: 150,
      render: (_, record) => (
        <span>{DateFormatter(record.pettyCashAccounting?.pcvDate)}</span>
      ),
    },
    {
      title: "PCV No",
      dataIndex: "pcvNo",
      key: "pcvNo",
      width: 150,
      render: (_, record) => (
        <span>{record.pettyCashAccounting?.pcvNo ?? "--"}</span>
      ),
    },
    {
      title: "Payee Name",
      dataIndex: "payeeName",
      key: "payeeName",
      render: (_, record) => (
        <span>{record.pettyCashAccounting?.payeeName ?? "--"}</span>
      ),
    },
    {
      title: "Reference Type",
      dataIndex: "referenceType",
      key: "referenceType",
      width: 200,
      render: (_, record) => (
        <Tag>{record.pettyCashAccounting?.referenceType ?? "--"}</Tag>
      ),
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 200,
      render: (_, record) => (
        <span>{record.pettyCashAccounting?.referenceNo ?? "--"}</span>
      ),
    },
    {
      title: "Amount Used",
      dataIndex: "amountUsed",
      key: "amountUsed",
      width: 130,
      align: "right",
      fixed: "right",
      render: (_, record) => {
        let amount = record.pettyCashAccounting?.amountUsed;
        return (
          <span>
            <small>{currency} </small>
            {NumberFormater(amount)}
          </span>
        );
      },
    },
    {
      title: "Applied Amount",
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
      width: 60,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
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
            Add Posted PCV
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
        summary={() => <PCVApplicationFooter dataSource={dataSource} />}
      />
    </div>
  );
}
