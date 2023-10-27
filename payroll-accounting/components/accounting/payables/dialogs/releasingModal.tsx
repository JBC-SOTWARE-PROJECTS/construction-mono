import React, { useState } from "react";
import {
  DisbursementCheck,
  Mutation,
  ReleaseCheck,
} from "@/graphql/gql/graphql";
import { PlusOutlined, SaveOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Row, Space, App, Table } from "antd";
import FullScreenModal from "@/components/common/fullScreenModal/fullScreenModal";
import { DateFormatter, NumberFormater, requiredField } from "@/utility/helper";
import { currency } from "@/utility/constant";
import { ColumnsType } from "antd/es/table";
import { FormDatePicker } from "@/components/common";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ChecksListSelectorModal from "./checksListModal";
import { useMutation } from "@apollo/client";
import dayjs, { Dayjs } from "dayjs";
import { UPSERT_RELEASE_CHECKS } from "@/graphql/payables/release-checks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
}

interface DataForm {
  releaseDate: Dayjs;
}

export default function ReleasingChecksModal(props: IProps) {
  const { message } = App.useApp();
  const { hide } = props;
  const [selected, setSelected] = useState<DisbursementCheck[]>([]);
  const [showPasswordConfirmation] = useConfirmationPasswordHook();

  const checkListSelector = useDialog(ChecksListSelectorModal);

  const [upsert, { loading }] = useMutation<Mutation>(UPSERT_RELEASE_CHECKS, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data?.upsertReleaseCheck as ReleaseCheck;
      if (result?.id) {
        hide(result);
      }
    },
  });

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: DataForm) => {
    const payload = (selected || []).map((obj) => {
      return {
        id: obj.id,
        releaseDate: dayjs(new Date()),
        disbursement: obj.disbursement,
        check: {
          id: obj.id,
          checkDate: obj.checkDate,
          checkNo: obj.checkNo,
          amount: obj.amount,
        },
        bank: obj.bank,
        isPosted: true,
      };
    });
    if (_.isEmpty(payload)) {
      return message.error("Please add checks to release");
    } else {
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            date: values.releaseDate,
            id: null,
          },
        });
      });
    }
  };

  const onShowTransaction = () => {
    checkListSelector({ payload: selected }, (e: DisbursementCheck[]) => {
      if (!_.isEmpty(e)) {
        if (_.isEmpty(selected)) {
          setSelected(e);
        } else {
          let concatArray = [...selected, ...e];
          let flush = _.uniqBy(concatArray, "id");
          setSelected(flush);
        }
      }
    });
  };

  const columns: ColumnsType<DisbursementCheck> = [
    {
      title: "CK No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.disNo}</span>
      ),
    },
    {
      title: "CK Date",
      dataIndex: "disDate",
      key: "disDate",
      width: 110,
      render: (text, record) => (
        <span key={text}>{DateFormatter(record.disbursement?.disDate)}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "disbursement.payeeName",
      key: "disbursement.payeeName",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.payeeName}</span>
      ),
    },
    {
      title: "Bank",
      dataIndex: "bank.bankname",
      key: "bank.bankname",
      width: 350,
      render: (text, record) => <span key={text}>{record.bank?.bankname}</span>,
    },
    {
      title: "Check Date",
      dataIndex: "checkDate",
      key: "checkDate",
      width: 100,
      render: (text) => <span key={text}>{DateFormatter(text)}</span>,
    },
    {
      title: "Check No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => <span key={text}>{record.checkNo}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      fixed: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
  ];

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<ExportOutlined />}
      title="Release Checks"
      footer={
        <div className="w-full dev-right">
          <Space>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              form="upsertForm"
              disabled={_.isEmpty(selected)}
              loading={loading}
              icon={<SaveOutlined />}>
              Release Chekcs
            </Button>
          </Space>
        </div>
      }>
      <Form
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          releaseDate: dayjs(new Date()),
        }}>
        <Row>
          <Col span={24}>
            <FormDatePicker
              label="Release Date"
              name="releaseDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
          </Col>
        </Row>
      </Form>
      {/*  */}
      <Divider plain>Checks to Release</Divider>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <div className="w-full dev-right">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onShowTransaction()}>
              Add Checks
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={selected}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            loading={false}
            scroll={{ x: 1400 }}
          />
        </Col>
      </Row>
    </FullScreenModal>
  );
}
