import React, { useState } from "react";
import FullScreenModal from "../common/fullScreenModal/fullScreenModal";
import {
  CarryOutOutlined,
  CheckOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Input,
  Divider,
  Table,
  App,
} from "antd";
import { ACCOUNT_TYPES, responsiveColumn4 } from "@/utility/constant";
import { FormSelect } from "../common";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@apollo/client";
import { ChartOfAccountGenerate } from "@/graphql/gql/graphql";
import { GET_COA_GEN_RECORDS } from "@/graphql/coa/queries";
import { OptionsValue } from "@/utility/interfaces";
import VirtualTable from "../virtualizeTable/virtualizeTable";
import _ from "lodash";
import numeral from "numeral";

interface IProps {
  hide: (hideProps: any) => void;
  type?: string;
  defaultSelected?: any[];
  singleSelect?: boolean;
}

const { Search } = Input;

export default function ChartOfAccountsComponentSelector(props: IProps) {
  const { message } = App.useApp();
  const { hide, singleSelect, defaultSelected } = props;
  const [state, setState] = useState({
    filter: "",
    accountType: null,
    motherAccount: null,
    subAccountType: "",
    department: null,
  });
  let _selectedCoa: any = {};
  if (defaultSelected) {
    defaultSelected.forEach((item) => {
      _selectedCoa[item.code] = item;
    });
  }
  const [motherAccounts, setMotherAccounts] = useState<OptionsValue[]>([]);
  const [subAccount, setSubAccount] = useState<OptionsValue[]>([]);
  const [departments, setDepartments] = useState<OptionsValue[]>([]);
  const [selectedCoa, setSelectedCoa] = useState<any>(_selectedCoa);
  //=============================queries===============================================
  const { loading, data } = useQuery(GET_COA_GEN_RECORDS, {
    fetchPolicy: "cache-and-network",
    variables: {
      accountType: state.accountType,
      motherAccountCode: state.motherAccount,
      subaccountType: state.subAccountType || "",
      description: state.filter,
      department: state.department,
      excludeMotherAccount: true,
    },
    onCompleted: (data) => {
      if (data) {
        const motherAccounts: OptionsValue[] = (data?.motherAccounts || []).map(
          (item: any) => {
            return {
              label: item.accountCode + "-" + item.description,
              value: item.accountCode,
            };
          }
        );
        const subaccountTypeAll: OptionsValue[] = (
          data?.subaccountTypeAll || []
        ).map((item: any) => {
          return {
            label: item.name,
            value: item.value,
          };
        });
        const flattedDept: OptionsValue[] = (data?.flattedDept || []).map(
          (item: any) => {
            return {
              label: item.code + "-" + item.description,
              value: item.code,
            };
          }
        );
        // ====================
        setMotherAccounts(motherAccounts);
        setSubAccount(subaccountTypeAll);
        setDepartments(flattedDept);
      }
    },
    onError: (error) => {
      if (error) {
        message.error(
          "Something went wrong. Cannot generate Chart of Accounts"
        );
      }
    },
  });
  //=============================functions =============================================
  const onProces = () => {
    let selected = [];
    for (let prop in selectedCoa) {
      selected.push({ ...selectedCoa[prop] });
    }
    if (selected.length === 0) {
      message.warning("No Selected Account");
      return;
    }
    hide(selected);
  };

  //==================== Selected Accounts Column =======================================
  const COAColumn: ColumnsType<ChartOfAccountGenerate> = [
    {
      title: "#",
      dataIndex: "checkbox",
      key: "checkbox",
      width: 70,
      align: "center",
      render: (value) => {
        if (value) {
          return <CheckOutlined style={{ color: "green" }} />;
        }
      },
    },
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => {
        return numeral(index + 1).format("0,0");
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      align: "center",
      key: "code",
      width: 200,
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
      align: "center",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];
  //==================== Selected Accounts Column =======================================
  const columns: ColumnsType<ChartOfAccountGenerate> = [
    {
      title: "Account Code",
      dataIndex: "code",
      key: "code",
      width: "50%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
  ];

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<FileDoneOutlined />}
      title="Chart of Accounts Selector"
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={onProces}
            icon={<CarryOutOutlined />}>
            Process Selected Accounts
          </Button>
        </Space>
      }>
      <Form layout="vertical">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              label="Filter Account Type"
              name="accountType"
              propsselect={{
                showSearch: true,
                options: ACCOUNT_TYPES,
                allowClear: true,
                placeholder: "Filter Account Type",
                onChange: (e) => {
                  setState((prev) => ({ ...prev, accountType: e }));
                },
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              label="Filter Mother Account"
              name="motherAccount"
              propsselect={{
                showSearch: true,
                options: motherAccounts,
                allowClear: true,
                placeholder: "Filter Mother Account",
                onChange: (e) => {
                  setState((prev) => ({ ...prev, motherAccount: e }));
                },
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              label="Filter By Sub-Account Type"
              name="subAccountType"
              propsselect={{
                showSearch: true,
                options: subAccount,
                allowClear: true,
                placeholder: "Filter By Sub-Account Type",
                onChange: (e) => {
                  setState((prev) => ({ ...prev, subAccountType: e }));
                },
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              label="Filter Department"
              name="department"
              propsselect={{
                showSearch: true,
                options: departments,
                allowClear: true,
                placeholder: "Filter Department",
                onChange: (e) => {
                  setState((prev) => ({ ...prev, department: e }));
                },
              }}
            />
          </Col>
        </Row>
        <Divider plain>Chart of Accounts</Divider>
        <Row>
          <Col span={24}>
            <VirtualTable
              rowKey="code"
              size="small"
              loading={loading}
              columns={COAColumn}
              dataSource={
                _.get(data, "coaList", []) as ChartOfAccountGenerate[]
              }
              scroll={{ y: 300 }}
              selected={selectedCoa}
              onRowClicked={(record: any) => {
                if (singleSelect) {
                  setSelectedCoa({
                    [record.code]: record,
                  });
                } else {
                  if (selectedCoa[record.code]) {
                    delete selectedCoa[record.code];
                    setSelectedCoa({
                      ...selectedCoa,
                    });
                  } else {
                    setSelectedCoa({
                      ...selectedCoa,
                      [record.code]: record,
                    });
                  }
                }
              }}
            />
          </Col>
        </Row>
        <Divider plain>Selected Accounts</Divider>
        <Row>
          <Col span={24}>
            <Table
              rowKey="code"
              size="small"
              columns={columns}
              dataSource={
                Object.values(selectedCoa) as ChartOfAccountGenerate[]
              }
              pagination={{
                pageSize: 4,
                showSizeChanger: false,
              }}
            />
          </Col>
        </Row>
      </Form>
    </FullScreenModal>
  );
}
