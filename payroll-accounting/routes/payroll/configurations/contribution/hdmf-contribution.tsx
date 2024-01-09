import React from "react";

import { Button, Space, Table } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import useGetScheduleTypes from "@/hooks/configurations/useManageTableMatrix";

import {
  UPSERT_HDMF_CONTRIBUTION,
  GET_HDMF_CONTRIBUTIONS,
} from "@/graphql/company/queries";

interface DataType {
  key: string;
  isEditable: boolean;
  minAmount: number;
  maxAmount: number;
  eeRate: number;
  erRate: number;
}

const initialValues: DataType = {
  key: "",
  isEditable: false,
  minAmount: 0,
  maxAmount: 0,
  eeRate: 0,
  erRate: 0,
};

function HDMFContribution() {
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
  ] = useGetScheduleTypes({
    upsertGQL: UPSERT_HDMF_CONTRIBUTION,
    queryGQL: GET_HDMF_CONTRIBUTIONS,
    initialValues,
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
          render: (_: any, { isEditable, minAmount }: any) =>
            isEditable ? renderInput("minAmount") : minAmount,
        },
        {
          title: "Max Amount",
          dataIndex: "maxAmount",
          key: "maxAmount",
          render: (_: any, { isEditable, maxAmount }: any) =>
            isEditable ? renderInput("maxAmount") : maxAmount,
        },
      ],
    },
    {
      title: "Employee's Contribution Rate",
      dataIndex: "eeRate",
      key: "eeRate",
      render: (_: any, { isEditable, eeRate }: any) =>
        isEditable ? renderInput("eeRate") : `${eeRate}%`,
    },
    {
      title: "Employer's Contribution Rate",
      dataIndex: "erRate",
      key: "erRate",
      render: (_: any, { isEditable, erRate }: any) =>
        isEditable ? renderInput("erRate") : `${erRate}%`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_: any, { isEditable, erRate, eeRate }: any) =>
        isEditable
          ? `${
              parseFloat(editableRow.eeRate || 0) +
              parseFloat(editableRow.erRate || 0)
            }%`
          : `${eeRate + erRate}%`,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => {
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
    <div>
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
              onClick={handleClickAdd}
              disabled={isEditing}
              loading={loading}
            >
              Add HDMF Contribution
            </Button>
          </ProFormGroup>
        }
      >
        <Table
          dataSource={dataSource}
          loading={loading}
          columns={columns}
          bordered
          size="small"
        />
      </ProCard>
    </div>
  );
}

export default HDMFContribution;
