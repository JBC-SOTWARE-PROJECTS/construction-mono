import React from "react";

import { Button, Space, Table } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";

import {
  GET_PHIC_CONTRIBUTIONS,
  UPSERT_PHIC_CONTRIBUTION,
} from "@/graphql/company/queries";
import useManageTableMatrix from "@/hooks/configurations/useManageTableMatrix";
import NumeralFormatter from "@/utility/numeral-formatter";

interface DataType {
  isEditable: boolean;
  minAmount: number;
  maxAmount: number;
  eeRate: number;
  erRate: number;
  premiumRate: number;
  monthlyPremium: number;
}

const initialValues: DataType = {
  isEditable: false,
  minAmount: 0,
  maxAmount: 0,
  eeRate: 0,
  erRate: 0,
  premiumRate: 0,
  monthlyPremium: 0,
};

function PhicContribution() {
  const [
    dataSource,
    loading,
    {
      isEditing,
      editableRow,
      handleClickAdd,
      handleEdit,
      handleSave,
      handleCancelEdit,
      renderInput,
    },
  ] = useManageTableMatrix({
    initialValues,
    upsertGQL: UPSERT_PHIC_CONTRIBUTION,
    queryGQL: GET_PHIC_CONTRIBUTIONS,
  });

  const columns = [
    {
      title: "Monthly Salary",
      key: "range",
      children: [
        {
          title: "Min Amount",
          dataIndex: "minAmount",
          key: "minAmount",
          render: (_: any, { isEditable, minAmount }: boolean & number) =>
            isEditable ? renderInput("minAmount") : minAmount,
        },
        {
          title: "Max Amount",
          dataIndex: "maxAmount",
          key: "maxAmount",
          render: (_: any, { isEditable, maxAmount }: boolean & number) =>
            isEditable ? renderInput("maxAmount") : maxAmount,
        },
      ],
    },
    {
      title: "Employee's Contribution Rate",
      dataIndex: "eeRate",
      key: "eeRate",
      render: (_: unknown, { isEditable, eeRate }: boolean & number) =>
        isEditable ? renderInput("eeRate") : `${eeRate}%`,
    },
    {
      title: "Employer's Contribution Rate",
      dataIndex: "erRate",
      key: "erRate",
      render: (_: unknown, { isEditable, erRate }: boolean & number) =>
        isEditable ? renderInput("erRate") : `${erRate}%`,
    },
    {
      title: "Premium Rate",
      dataIndex: "premiumRate",
      key: "premiumRate",
      render: (value: any) =>
        `${
          isEditing
            ? parseFloat(editableRow.erRate || 0) +
              parseFloat(editableRow.eeRate || 0)
            : value
        }%`,
    },
    {
      title: "Monthly Premium",
      key: "monthlyPremium",
      render: (
        _: any,
        { isEditable, premiumRate, minAmount, maxAmount }: boolean & number
      ) => {
        const floatRate = isEditable
          ? (editableRow.eeRate + editableRow.erRate) / 100
          : premiumRate / 100;

        const min = isEditable
          ? `${parseFloat(editableRow.minAmount || 0) * floatRate}`
          : `${minAmount * floatRate}`;
        const max = isEditable
          ? `${parseFloat(editableRow.maxAmount || 0) * floatRate}`
          : `${maxAmount * floatRate}`;
        return (
          <>
            <NumeralFormatter
              format={"0,0.[00]"}
              withPesos={false}
              value={min}
            />{" "}
            to{" "}
            <NumeralFormatter
              format={"0,0.[00]"}
              withPesos={false}
              value={max}
            />
          </>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, record: any) => {
        return (
          <Space size="small">
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
    <ProCard
      headStyle={{
        flexWrap: "wrap",
      }}
      bordered
      headerBordered
      extra={
        <ProFormGroup>
          <Button
            htmlType="submit"
            form="upsertForm"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleClickAdd()}
            disabled={isEditing}
            loading={loading}
          >
            Add PHIC Contribution
          </Button>
        </ProFormGroup>
      }
    >
      <div>
        <Table
          dataSource={dataSource}
          loading={loading}
          columns={columns}
          bordered
          size="small"
        />
      </div>
    </ProCard>
  );
}

export default PhicContribution;
