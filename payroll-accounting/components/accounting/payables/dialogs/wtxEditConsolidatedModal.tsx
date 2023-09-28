import React, { useState } from "react";
import FormTextArea from "@/components/common/formTextArea/formTextArea";
import { Query, Wtx2307, Wtx2307Consolidated } from "@/graphql/gql/graphql";
import {
  GET_WTX_LIST_BY_REF,
  UPSERT_CONSOLIDATED_WTX,
  REMOVE_WTX_FROM_CONSOLIDATED,
} from "@/graphql/payables/wtx-queries";
import { useConfirmationPasswordHook } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import {
  DeleteOutlined,
  ReconciliationOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  App,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import WTXListModal from "./wtxListModal";
import { useDialog } from "@/hooks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record: Wtx2307Consolidated;
  parentRefetch: () => void;
}

const formatter = (value: number) => (
  <p className="currency-red">
    {currency + " "}
    {NumberFormater(value)}
  </p>
);

export default function WTXEditConsolidatedModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const modal = useDialog(WTXListModal);
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [items, setItems] = useState<Wtx2307[]>([]);
  // ===================== Queries ==============================
  const { loading, refetch } = useQuery<Query>(GET_WTX_LIST_BY_REF, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data: Query) => {
      const list = data.wtxListByRef as Wtx2307[];
      setItems(list);
    },
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_CONSOLIDATED_WTX,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  const [remove, { loading: removeLoading }] = useMutation(
    REMOVE_WTX_FROM_CONSOLIDATED,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        const result: Wtx2307 = data.update2307;
        if (result.id) {
          message.success("2307 Successfully removed");
          refetch();
          props?.parentRefetch();
        }
      },
    }
  );
  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };
    if (_.size(items) > 10) {
      return message.error(
        "Up Ten (10) 2307 can be consolidated. Please try again."
      );
    } else {
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            items: items,
            id: record?.id,
            supplier: record?.supplier?.id,
          },
        });
      });
    }
  };

  const onRemove2307 = (record: Wtx2307) => {
    showPasswordConfirmation(() => {
      remove({
        variables: {
          id: record?.id,
          status: false,
          ref: null,
        },
      });
    });
  };

  const onAdd2307 = () => {
    modal({ record: record, size: _.size(items) }, (result: any) => {
      if (result) {
        refetch();
        props?.parentRefetch();
      }
    });
  };

  // ================ columns ================================
  const columns: ColumnsType<Wtx2307> = [
    {
      title: "Date",
      dataIndex: "wtxDate",
      key: "wtxDate",
      width: 125,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Source Document",
      dataIndex: "sourceDoc",
      key: "sourceDoc",
      render: (text, record) => <span key={text}>{text ?? record?.refNo}</span>,
    },
    {
      title: "Ref. No",
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "Supplier/Payee",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
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
      width: 50,
      render: (text, record) => (
        <Button
          key={text}
          icon={<DeleteOutlined />}
          danger
          size="small"
          onClick={() => onRemove2307(record)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> View Consolidated 2307:
            {record?.supplier && (
              <Tag color="magenta">{record?.supplier?.supplierFullname}</Tag>
            )}
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
            htmlType="submit"
            form="wtxForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            Save Remarks & Close
          </Button>
        </Space>
      }>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <p>
            <span className="font-bold">Date From: </span>
            {dayjs(record?.dateFrom).format("MMM DD, YYYY")}
          </p>
          <p>
            <span className="font-bold">Date to: </span>
            {dayjs(record?.dateTo).format("MMM DD, YYYY")}
          </p>
          <Divider className="my-5" />
          <Form
            name="wtxForm"
            layout="vertical"
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}>
            <FormTextArea
              label="Remarks/Notes"
              name="remarks"
              propstextarea={{
                placeholder: "Remarks/Notes",
              }}
            />
          </Form>
          <div className="w-full dev-between">
            <Statistic
              title="Total Amount"
              value={_.sumBy(items, "ewtAmount")}
              formatter={(e) => {
                let value = Number(e);
                return formatter(value);
              }}
            />
            <Button
              size="middle"
              type="dashed"
              icon={<ReconciliationOutlined />}
              disabled={_.size(items) >= 10}
              onClick={onAdd2307}>
              Add 2307 (WTX)
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            loading={loading || removeLoading}
            columns={columns}
            dataSource={items}
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
}
