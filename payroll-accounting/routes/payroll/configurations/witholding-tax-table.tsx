import { WithholdingTaxMatrix } from "@/graphql/gql/graphql";
import useManageTableMatrix from "@/hooks/configurations/useManageTableMatrix";
import NumeralFormatter from "@/utility/numeral-formatter";
import {
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { gql } from "@apollo/client";
import { Button, Col, Input, Row, Space, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
const MUTATION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    result: upsertWithholdingTaxMatrix(id: $id, fields: $fields) {
      message
      success
    }
  }
`;

const QUERY = gql`
  query {
    list: getWithholdingTaxMatrix {
      id
      minAmount
      maxAmount
      baseAmount
      percentage
      thresholdAmount
      type
      lastModifiedBy
      lastModifiedDate
    }
  }
`;
function WithholdingTaxTable() {
  const [
    dataSource,
    loading,
    {
      isEditing,
      handleClickAdd,
      handleEdit,
      handleSave,
      handleCancelEdit,
      renderInput,
    },
  ] = useManageTableMatrix({
    initialValues: {},
    upsertGQL: MUTATION,
    queryGQL: QUERY,
  });

  const render = (
    isEditable: any,
    value: any,
    key: string,
    suffix?: string
  ) => {
    return isEditable ? (
      renderInput(key, suffix)
    ) : (
      <div style={{ width: "100%", textAlign: "center" }}>
        {suffix ? `${value}${suffix}` : <NumeralFormatter value={value} />}
      </div>
    );
  };
  const columns: ColumnsType<any> = [
    {
      title: "Compensation Range",
      children: [
        {
          title: "Min Amount",
          dataIndex: "minAmount",
          key: "minAmount",
          render: (_, { isEditable, minAmount }) =>
            render(isEditable, minAmount, "minAmount"),
        },
        {
          title: "Max Amount",
          dataIndex: "maxAmount",
          key: "maxAmount",
          render: (_, { isEditable, maxAmount }) =>
            render(isEditable, maxAmount, "maxAmount"),
        },
      ],
    },
    {
      title: "Prescribed Withholding Tax",
      dataIndex: "tax",
      render: (_, record) => {
        return (
          <Row>
            <Col span={4}>
              {render(record?.isEditable, record?.baseAmount, "baseAmount")}
            </Col>
            <Col span={2}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <b>+</b>
              </div>
            </Col>
            <Col span={4}>
              {render(
                record?.isEditable,
                record?.percentage,
                "percentage",
                "%"
              )}
            </Col>
            <Col span={4}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <b>over</b>
              </div>
            </Col>
            <Col span={4}>
              {render(
                record?.isEditable,
                record?.thresholdAmount,
                "thresholdAmount"
              )}
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              shape="circle"
              ghost
              loading={loading}
              disabled={isEditing && !record?.isEditable}
              icon={record?.isEditable ? <SaveOutlined /> : <EditOutlined />}
              onClick={
                record?.isEditable
                  ? handleSave
                  : () => {
                      handleEdit(record);
                    }
              }
            />
            {record?.isEditable && (
              <Button
                htmlType="submit"
                type="primary"
                shape="circle"
                loading={loading}
                danger
                ghost
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Tabs
        type="card"
        defaultActiveKey="1"
        items={[
          {
            key: "Weekly",
            label: `Weekly`,
            children: (
              <>
                <Button
                  htmlType="submit"
                  form="upsertForm"
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    handleClickAdd("WEEKLY");
                  }}
                  disabled={isEditing}
                  loading={loading}
                >
                  Add Row
                </Button>
                <br />
                <br />
                <Table
                  columns={columns}
                  dataSource={dataSource?.filter(
                    (item: WithholdingTaxMatrix) => item?.type === "WEEKLY"
                  )}
                  loading={loading}
                  bordered
                />
              </>
            ),
          },
          {
            key: "Semi-monthly",
            label: `Semi-monthly`,
            children: (
              <>
                <Button
                  htmlType="submit"
                  form="upsertForm"
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    handleClickAdd("SEMI_MONTHLY");
                  }}
                  disabled={isEditing}
                  loading={loading}
                >
                  Add Row
                </Button>
                <br />
                <br />
                <Table
                  columns={columns}
                  dataSource={dataSource?.filter(
                    (item: WithholdingTaxMatrix) =>
                      item?.type === "SEMI_MONTHLY"
                  )}
                  loading={loading}
                  bordered
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}

export default WithholdingTaxTable;
