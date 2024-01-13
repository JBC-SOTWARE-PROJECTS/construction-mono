import {
  CloseOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Space, Table } from "antd";

import {
  GET_SSS_CONTRIBUTIONS,
  UPSERT_SSS_CONTRIBUTION,
} from "@/graphql/company/queries";
import useManageTableMatrix from "@/hooks/configurations/useManageTableMatrix";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  isEditable: boolean;
  minAmount: number;
  maxAmount: number;
  monthlySalaryCredit: number;
  eeContribution: number;
  erContribution: number;
  wispEeContribution: number;
  wispErContribution: number;
  er_ec_Contribution: number;
}

const initialValues: DataType = {
  isEditable: false,
  minAmount: 0,
  maxAmount: 0,
  monthlySalaryCredit: 0,
  erContribution: 0,
  eeContribution: 0,
  er_ec_Contribution: 0,
  wispErContribution: 0,
  wispEeContribution: 0,
};

function SSSContribution() {
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
    upsertGQL: UPSERT_SSS_CONTRIBUTION,
    queryGQL: GET_SSS_CONTRIBUTIONS,
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Range of Compensation",
      dataIndex: "range",
      key: "range",
      children: [
        {
          title: "Min Amount",
          dataIndex: "minAmount",
          key: "minAmount",
          render: (_, { isEditable, minAmount }) =>
            isEditable ? renderInput("minAmount") : minAmount,
        },
        {
          title: "Max Amount",
          dataIndex: "maxAmount",
          key: "maxAmount",
          render: (_, { isEditable, maxAmount }) =>
            isEditable ? renderInput("maxAmount") : maxAmount,
        },
      ],
    },
    {
      title: "Employed",
      key: "employed",
      children: [
        {
          title: "Monthly Salary Credit",
          dataIndex: "monthlySalaryCredit",
          key: "monthlySalaryCredit",
          render: (val, { isEditable }) =>
            isEditable ? renderInput("monthlySalaryCredit") : val,
        },
        {
          title: "SSS Contribution",
          key: "sssContribution",
          children: [
            {
              title: "ER",
              dataIndex: "erContribution",
              key: "erContribution",
              render: (val, { isEditable }) =>
                isEditable ? renderInput("erContribution") : val,
            },
            {
              title: "EE",
              dataIndex: "eeContribution",
              key: "eeContribution",
              render: (val, { isEditable }) =>
                isEditable ? renderInput("eeContribution") : val,
            },
            {
              title: "Total",
              dataIndex: "sssTotal",
              key: "sssTotal",
              render: (_, { isEditable, eeContribution, erContribution }) => {
                if (isEditable)
                  return (
                    parseInt(editableRow.eeContribution || 0) +
                    parseInt(editableRow.erContribution || 0)
                  );
                else return eeContribution + erContribution;
              },
            },
          ],
        },
        {
          title: "EC Contribution",
          dataIndex: "ecContribution",
          key: "ecContribution",
          children: [
            {
              title: "ER",
              dataIndex: "er_ec_Contribution",
              key: "er_ec_Contribution",
              render: (val, { isEditable }) =>
                isEditable ? renderInput("er_ec_Contribution") : val,
            },
          ],
        },
        {
          title: "WISP Contribution",
          key: "wispContribution",
          children: [
            {
              title: "ER",
              dataIndex: "wispErContribution",
              key: "wispErContribution",
              render: (val, { isEditable }) =>
                isEditable ? renderInput("wispErContribution") : val,
            },
            {
              title: "EE",
              dataIndex: "wispEeContribution",
              key: "wispEeContribution",
              render: (val, { isEditable }) =>
                isEditable ? renderInput("wispEeContribution") : val,
            },
            {
              title: "Total",
              dataIndex: "wispTotal",
              key: "wispTotal",
              render: (
                _,
                { isEditable, wispEeContribution, wispErContribution }
              ) => {
                if (isEditable)
                  return (
                    parseInt(editableRow.wispEeContribution || 0) +
                    parseInt(editableRow.wispErContribution || 0)
                  );
                else return wispEeContribution + wispErContribution;
              },
            },
          ],
        },
        {
          title: "Total Contribution",
          key: "totalContribution",
          children: [
            {
              title: "ER",
              dataIndex: "totalEr",
              key: "totalEr",
              render: (
                _,
                {
                  isEditable,
                  erContribution,
                  er_ec_Contribution,
                  wispErContribution,
                }
              ) => {
                if (isEditable)
                  return (
                    parseInt(editableRow.erContribution || 0) +
                    parseInt(editableRow.er_ec_Contribution || 0) +
                    parseInt(editableRow.wispErContribution || 0)
                  );
                else {
                  return (
                    erContribution + er_ec_Contribution + wispErContribution
                  );
                }
              },
            },
            {
              title: "EE",
              dataIndex: "ee",
              key: "ee",
              render: (
                _,
                { isEditable, eeContribution, wispEeContribution }
              ) => {
                if (isEditable)
                  return (
                    editableRow.eeContribution + editableRow.wispEeContribution
                  );
                else return eeContribution + wispEeContribution;
              },
            },
            {
              title: "Total",
              dataIndex: "employedTotal",
              key: "employedTotal",
              render: (
                _,
                {
                  isEditable,
                  erContribution,
                  eeContribution,
                  er_ec_Contribution,
                  wispEeContribution,
                  wispErContribution,
                }
              ) => {
                if (isEditable)
                  return (
                    parseInt(editableRow.erContribution || 0) +
                    parseInt(editableRow.eeContribution || 0) +
                    parseInt(editableRow.er_ec_Contribution || 0) +
                    parseInt(editableRow.wispEeContribution || 0) +
                    parseInt(editableRow.wispErContribution || 0)
                  );
                else
                  return (
                    erContribution +
                    eeContribution +
                    er_ec_Contribution +
                    wispEeContribution +
                    wispErContribution
                  );
              },
            },
          ],
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          render: (_, record) => {
            return (
              <Space size="small">
                <Button
                  htmlType="submit"
                  type="primary"
                  shape="circle"
                  ghost
                  loading={loading}
                  disabled={isEditing && !record?.isEditable}
                  icon={
                    record?.isEditable ? <SaveOutlined /> : <EditOutlined />
                  }
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
      ],
    },
  ];

  return (
    <>
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
              Add SSS Contribution
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
    </>
  );
}

export default SSSContribution;
